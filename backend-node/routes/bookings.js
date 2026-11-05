import { Router } from "express";
import { v4 as uuid } from "uuid";
import db from "../db.js";
import { authRequired } from "../middleware/auth.js";

const router = Router();

router.post("/", authRequired, (req, res) => {
  try {
    const { slotId, startTime, duration } = req.body;
    const date = new Date().toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata' });
    const slot = db.prepare("SELECT * FROM slots WHERE id = ?").get(slotId);
    if (!slot) return res.status(404).json({ error: "Slot not found" });
    if (slot.status !== "available") return res.status(409).json({ error: "Slot not available" });

    const hours = duration || 2;
    const amount = slot.price_per_hour * hours;
    const user = db.prepare("SELECT * FROM users WHERE id = ?").get(req.user.id);
    if (!user) return res.status(404).json({ error: "User not found." });
    if (user.wallet < amount) return res.status(402).json({ error: "Insufficient wallet" });

        const endTs = Date.now() + hours * 3600000;
    const endTime = new Date(endTs).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true, timeZone: 'Asia/Kolkata' });

    const bookingId = `BKG-${Math.floor(1000 + Math.random() * 9000)}`;
    db.prepare("INSERT INTO bookings (id, user_id, slot_id, date, start_time, end_time, duration, amount) VALUES (?, ?, ?, ?, ?, ?, ?, ?)").run(bookingId, req.user.id, slotId, date, startTime, endTime, hours, amount);
    db.prepare("UPDATE slots SET status = 'reserved' WHERE id = ?").run(slotId);
    db.prepare("UPDATE users SET wallet = wallet - ? WHERE id = ?").run(amount, req.user.id);

    const earnedPoints = slot.type === "ev" ? 50 : 20;
    db.prepare("UPDATE users SET points = points + ? WHERE id = ?").run(earnedPoints, req.user.id);
    db.prepare("INSERT INTO transactions (id, user_id, type, amount, note) VALUES (?, ?, ?, ?, ?)").run(uuid(), req.user.id, "debit", amount, `Booking ${slot.label} for ${hours} hrs`);

    res.json({ ok: true, bookingId, amount, earnedPoints, endTime });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Booking failed" });
  }
});

router.get("/mine", authRequired, (req, res) => {
  res.json(db.prepare("SELECT b.*, s.label as slot_label, s.type as slot_type FROM bookings b JOIN slots s ON s.id = b.slot_id WHERE b.user_id = ? AND b.status = 'active' ORDER BY b.created_at DESC").all(req.user.id));
});

router.post("/:id/cancel", authRequired, (req, res) => {
  const booking = db.prepare("SELECT * FROM bookings WHERE id = ? AND user_id = ?").get(req.params.id, req.user.id);
  if (!booking) return res.status(404).json({ error: "Not found" });
  db.prepare("UPDATE bookings SET status = 'cancelled' WHERE id = ?").run(booking.id);
  db.prepare("UPDATE slots SET status = 'available' WHERE id = ?").run(booking.slot_id);
  db.prepare("UPDATE users SET wallet = wallet + ? WHERE id = ?").run(booking.amount, req.user.id);
  db.prepare("INSERT INTO transactions (id, user_id, type, amount, note) VALUES (?, ?, ?, ?, ?)").run(uuid(), req.user.id, "credit", booking.amount, `Refund ${booking.id}`);
  res.json({ ok: true });
});

router.post("/:id/extend", authRequired, (req, res) => {
  try {
    const booking = db.prepare("SELECT b.*, s.price_per_hour FROM bookings b JOIN slots s ON s.id = b.slot_id WHERE b.id = ? AND b.user_id = ?").get(req.params.id, req.user.id);
    if (!booking) return res.status(404).json({ error: "Booking not found" });

    const user = db.prepare("SELECT * FROM users WHERE id = ?").get(req.user.id);
    const extraAmount = booking.price_per_hour * 1;
    if (user.wallet < extraAmount) return res.status(402).json({ error: "Insufficient wallet" });

    // Instead of parsing the old time, just add 1 hour to the CURRENT time
    // (this handles both active and expired bookings gracefully)
    const newEndTs = Date.now() + 3600000;
    const newEndTime = new Date(newEndTs).toLocaleTimeString('en-IN', { 
      hour: '2-digit', 
      minute: '2-digit', 
      hour12: true,
      timeZone: 'Asia/Kolkata'
    });

    db.prepare("UPDATE bookings SET end_time = ?, duration = duration + 1, amount = amount + ? WHERE id = ?").run(newEndTime, extraAmount, booking.id);
    db.prepare("UPDATE users SET wallet = wallet - ? WHERE id = ?").run(extraAmount, req.user.id);
    db.prepare("INSERT INTO transactions (id, user_id, type, amount, note) VALUES (?, ?, ?, ?, ?)").run(uuid(), req.user.id, "debit", extraAmount, `Extended ${booking.id}`);

    res.json({ ok: true, newEndTime, extraAmount });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Extension failed" });
  }
});
export default router;
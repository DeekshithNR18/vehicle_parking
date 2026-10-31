import { Router } from "express";
import db from "../db.js";
import { authRequired } from "../middleware/auth.js";

const router = Router();

router.post("/", authRequired, (req, res) => {
  const { name, guests = 1, vehicle = "N/A" } = req.body;
  if (!name) return res.status(400).json({ error: "Name required" });
  const id = `VP-${Math.floor(1000 + Math.random() * 9000)}`;
  const expiresAt = new Date(Date.now() + 4 * 3600000).toISOString();
  db.prepare("INSERT INTO visitor_passes (id, user_id, name, guests, vehicle, expires_at) VALUES (?, ?, ?, ?, ?, ?)").run(id, req.user.id, name, guests, vehicle, expiresAt);
  res.json({ ok: true, pass: { id, name, guests, vehicle, expiresAt } });
});

router.get("/mine", authRequired, (req, res) => {
  res.json(db.prepare("SELECT * FROM visitor_passes WHERE user_id = ? ORDER BY created_at DESC").all(req.user.id));
});

export default router;

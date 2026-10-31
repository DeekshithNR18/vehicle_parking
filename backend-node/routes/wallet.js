import { Router } from "express";
import { v4 as uuid } from "uuid";
import db from "../db.js";
import { authRequired } from "../middleware/auth.js";

const router = Router();

router.get("/", authRequired, (req, res) => {
  const user = db.prepare("SELECT wallet FROM users WHERE id = ?").get(req.user.id);
  const tx = db.prepare("SELECT * FROM transactions WHERE user_id = ? ORDER BY created_at DESC LIMIT 50").all(req.user.id);
  res.json({ balance: user.wallet, transactions: tx });
});

router.post("/topup", authRequired, (req, res) => {
  const { amount } = req.body;
  if (!amount || amount <= 0) return res.status(400).json({ error: "Invalid amount" });
  db.prepare("UPDATE users SET wallet = wallet + ? WHERE id = ?").run(amount, req.user.id);
  db.prepare("INSERT INTO transactions (id, user_id, type, amount, note) VALUES (?, ?, ?, ?, ?)").run(uuid(), req.user.id, "credit", amount, "Wallet top-up");
  res.json({ ok: true });
});

export default router;

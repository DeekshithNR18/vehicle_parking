import { Router } from "express";
import { v4 as uuid } from "uuid";
import db from "../db.js";
import { authRequired, adminRequired } from "../middleware/auth.js";

const router = Router();

router.post("/", authRequired, (req, res) => {
  const { title, priority = "normal", hasPhoto = false } = req.body;
  if (!title) return res.status(400).json({ error: "Title required" });
  const ticketId = `TKT-${Math.floor(1000 + Math.random() * 9000)}`;
  const id = uuid();
  db.prepare("INSERT INTO complaints (id, user_id, ticket_id, title, priority, has_photo) VALUES (?, ?, ?, ?, ?, ?)").run(id, req.user.id, ticketId, title, priority, hasPhoto ? 1 : 0);
  res.json({ ok: true, id, ticketId });
});

router.get("/mine", authRequired, (req, res) => {
  res.json(db.prepare("SELECT * FROM complaints WHERE user_id = ? ORDER BY created_at DESC").all(req.user.id));
});

router.get("/all", authRequired, adminRequired, (req, res) => {
  res.json(db.prepare("SELECT c.*, u.name as user_name FROM complaints c JOIN users u ON u.id = c.user_id ORDER BY c.created_at DESC").all());
});

router.post("/:id/reply", authRequired, adminRequired, (req, res) => {
  const { reply } = req.body;
  if (!reply) return res.status(400).json({ error: "Reply required" });
  db.prepare("UPDATE complaints SET reply = ?, status = 'in-progress' WHERE id = ?").run(reply, req.params.id);
  res.json({ ok: true });
});

router.post("/:id/resolve", authRequired, adminRequired, (req, res) => {
  db.prepare("UPDATE complaints SET status = 'resolved' WHERE id = ?").run(req.params.id);
  res.json({ ok: true });
});

export default router;

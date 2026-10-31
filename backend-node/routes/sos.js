import { Router } from "express";
import { v4 as uuid } from "uuid";
import db from "../db.js";
import { authRequired } from "../middleware/auth.js";

const router = Router();

router.post("/", authRequired, (req, res) => {
  const user = db.prepare("SELECT name FROM users WHERE id = ?").get(req.user.id);
  const id = uuid();
  db.prepare("INSERT INTO sos_alerts (id, user_id, user_name) VALUES (?, ?, ?)").run(id, req.user.id, user.name);
  res.json({ ok: true, id });
});

router.get("/all", authRequired, (req, res) => {
  res.json(db.prepare("SELECT * FROM sos_alerts WHERE status = 'active' ORDER BY created_at DESC").all());
});

router.post("/:id/resolve", authRequired, (req, res) => {
  db.prepare("UPDATE sos_alerts SET status = 'resolved' WHERE id = ?").run(req.params.id);
  res.json({ ok: true });
});

export default router;

import { Router } from "express";
import db from "../db.js";
import { authRequired } from "../middleware/auth.js";

const router = Router();

router.get("/", (req, res) => {
  res.json(db.prepare("SELECT * FROM slots ORDER BY label").all());
});

router.patch("/:id", authRequired, (req, res) => {
  if (req.user.role !== "admin") return res.status(403).json({ error: "Admin only" });
  db.prepare("UPDATE slots SET status = ? WHERE id = ?").run(req.body.status, req.params.id);
  res.json({ ok: true });
});

export default router;

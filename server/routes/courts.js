import { Router } from "express";
import pool from "../db.js";

const router = Router();

router.get("/", async (req, res) => {
  const { rows } = await pool.query("SELECT * FROM courts ORDER BY id");
  res.json(rows);
});

router.get("/:id/availability", async (req, res) => {
  const { id } = req.params;
  const { date } = req.query;
  if (!date) return res.status(400).json({ error: "date query param required" });

  const { rows } = await pool.query(
    "SELECT time FROM bookings WHERE court_id = $1 AND date = $2",
    [id, date]
  );
  res.json(rows.map((r) => r.time));
});

export default router;

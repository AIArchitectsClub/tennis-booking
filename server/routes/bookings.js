import { Router } from "express";
import { fromNodeHeaders } from "better-auth/node";
import pool from "../db.js";
import { auth } from "../auth.js";

const router = Router();

async function requireAuth(req, res, next) {
  const session = await auth.api.getSession({ headers: fromNodeHeaders(req.headers) });
  if (!session) return res.status(401).json({ error: "Unauthorised" });
  req.session = session;
  next();
}

router.get("/", requireAuth, async (req, res) => {
  const { rows } = await pool.query(
    "SELECT * FROM bookings WHERE user_id = $1 ORDER BY date, time",
    [req.session.user.id]
  );
  res.json(rows);
});

router.post("/", requireAuth, async (req, res) => {
  const { courtId, courtName, date, time, price } = req.body;
  const playerName = req.session.user.name;
  const userId = req.session.user.id;
  try {
    const { rows } = await pool.query(
      `INSERT INTO bookings (court_id, court_name, date, time, player_name, price, user_id)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [courtId, courtName, date, time, playerName, price, userId]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    if (err.code === "23505") {
      return res.status(409).json({ error: "That slot is already booked." });
    }
    throw err;
  }
});

router.delete("/:id", requireAuth, async (req, res) => {
  await pool.query(
    "DELETE FROM bookings WHERE id = $1 AND user_id = $2",
    [req.params.id, req.session.user.id]
  );
  res.sendStatus(204);
});

export default router;

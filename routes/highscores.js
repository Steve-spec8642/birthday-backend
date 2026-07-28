import express from 'express';
import pool from '../db.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT player_name, score, created_at FROM high_scores ORDER BY score DESC LIMIT 10'
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching high scores:', err);
    res.status(500).json({ error: 'Failed to fetch high scores.' });
  }
});

router.post('/', async (req, res) => {
  const { playerName, score } = req.body;

  if (typeof playerName !== 'string' || playerName.trim().length === 0) {
    return res.status(400).json({ error: 'playerName is required.' });
  }
  if (playerName.length > 20) {
    return res.status(400).json({ error: 'playerName must be 20 characters or fewer.' });
  }
  if (typeof score !== 'number' || !Number.isFinite(score) || score < 0) {
    return res.status(400).json({ error: 'score must be a non-negative number.' });
  }
  if (score > 1000000) {
    return res.status(400).json({ error: 'score exceeds allowed maximum.' });
  }

  const cleanName = playerName.trim().replace(/[^a-zA-Z0-9 ]/g, '').slice(0, 20);
  if (cleanName.length === 0) {
    return res.status(400).json({ error: 'playerName must contain valid characters.' });
  }

  try {
    const result = await pool.query(
      'INSERT INTO high_scores (player_name, score) VALUES ($1, $2) RETURNING *',
      [cleanName, Math.floor(score)]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error saving high score:', err);
    res.status(500).json({ error: 'Failed to save high score.' });
  }
});

export default router;
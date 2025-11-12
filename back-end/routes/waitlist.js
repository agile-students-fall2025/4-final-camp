const r = require('express').Router();

// POST /api/waitlist
r.post('/', (req, res) => {
  const { userId, itemId } = req.body || {};
  if (!userId || !itemId) return res.status(400).json({ error: 'Missing userId or itemId' });
  return res.status(201).json({ ok: true, waitlistId: 'w_001', userId, itemId });
});

module.exports = r;

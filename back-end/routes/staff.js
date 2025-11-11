const r = require('express').Router();

// GET /api/staff/inventory
r.get('/inventory', (_req, res) => res.status(200).json([
  { id: 'itm_1234', name: 'Canon EOS R10', category: 'Electronics', facility: 'IM Lab', status: 'available' },
]));

// POST /api/staff/items
r.post('/items', (req, res) => {
  const { name, category, facility, status } = req.body || {};
  if (!name) return res.status(400).json({ error: 'Missing name' });
  return res.status(201).json({ ok: true, id: 'itm_new', name, category, facility, status: status || 'available' });
});

// POST /api/staff/checkout
r.post('/checkout', (req, res) => {
  const { userId, itemId } = req.body || {};
  if (!userId || !itemId) return res.status(400).json({ error: 'Missing userId or itemId' });
  return res.status(201).json({ ok: true, borrowalId: 'bor_002' });
});

// POST /api/staff/checkin
r.post('/checkin', (req, res) => {
  const { itemId } = req.body || {};
  if (!itemId) return res.status(400).json({ error: 'Missing itemId' });
  return res.status(201).json({ ok: true, itemId, status: 'available' });
});

// GET /api/staff/reservations
r.get('/reservations', (_req, res) => res.status(200).json([]));

// GET /api/staff/overdue
r.get('/overdue', (_req, res) => res.status(200).json([]));

// GET /api/staff/alerts
r.get('/alerts', (_req, res) => res.status(200).json([]));

// GET /api/staff/fines
r.get('/fines', (_req, res) => res.status(200).json([]));

module.exports = r;

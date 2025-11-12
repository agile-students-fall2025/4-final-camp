const r = require('express').Router();

// POST /api/payments/:fineId/pay
r.post('/:fineId/pay', (req, res) => {
  const { fineId } = req.params;
  const { method, last4, name, email } = req.body || {};
  if (!method || !name) return res.status(400).json({ error: 'Missing payment fields' });
  return res.status(201).json({ ok: true, fineId, receiptId: 'rcpt_001' });
});

// GET /api/payments/history?userId=usr_001
r.get('/history', (req, res) => {
  const { userId } = req.query;
  if (!userId) return res.status(400).json({ error: 'Missing userId' });
  // Exact data from payment-history.json
  const payments = [
    {
      id: 1,
      receipt: "R-58231",
      amount: 5,
      date: "Oct 13, 2025",
      method: "Campus Cash"
    },
    {
      id: 2,
      receipt: "R-1012",
      amount: 3,
      date: "Oct 01, 2025",
      method: "Campus Cash"
    }
  ];
  return res.status(200).json({ payments });
});

module.exports = r;

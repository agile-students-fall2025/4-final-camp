const r = require('express').Router();

// POST /api/auth/student/login
r.post('/student/login', (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) return res.status(400).json({ error: 'Missing credentials' });
  // stub auth
  return res.status(200).json({ token: 'stub-token', userId: 'usr_001' });
});

module.exports = r;

const r = require('express').Router();

// GET /api/policies
r.get('/', (_req, res) => {
  res.status(200).json({
    borrowingPeriodDays: 7,
    lateFeePerDay: 5,
    maxConcurrentLoans: 2,
  });
});

module.exports = r;

const express = require('express');
const router = express.Router();

// GET /api/dashboard?userId=usr_001
router.get('/', (req, res) => {
  const { userId } = req.query;
  if (!userId) return res.status(400).json({ error: 'Missing userId' });

  // Exact data from dashboard.json
  const stats = [
    {
      id: "activeBorrowals",
      label: "Active Borrowals",
      value: 3
    },
    {
      id: "overdueItems",
      label: "Overdue Items",
      value: 2
    }
  ];

  const dueItems = [
    {
      id: "borrowal-1021",
      name: "Canon EOS R5",
      dueDisplay: "Oct 15, 2:00 PM",
      location: "Arts Centre"
    },
    {
      id: "borrowal-1044",
      name: "MacBook Pro 16\"",
      dueDisplay: "Oct 16, 4:00 PM",
      location: "IM Lab"
    }
  ];

  res.status(200).json({
    stats,
    dueItems
  });
});

module.exports = router;

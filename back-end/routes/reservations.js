const express = require("express");
const router = express.Router();

const reservations = [
  { id: 1, user: "Akshith", item: "Camera", date: "2025-11-10", status: "reserved" },
];

router.get("/", (req, res) => res.json(reservations));

router.post("/", (req, res) => {
  const newRes = { id: reservations.length + 1, ...req.body };
  reservations.push(newRes);
  res.status(201).json(newRes);
});

// GET /api/reservations/slots?facility=IM%20Lab&date=2025-10-20
router.get("/slots", (req, res) => {
  const { facility, date } = req.query;
  
  // Exact data from reservation-slots.json
  const dates = ["Oct 15", "Oct 16", "Oct 17"];
  const timeBlocks = ["10:00-12:00", "14:00-16:00", "16:00-18:00"];

  res.status(200).json({
    dates,
    timeBlocks
  });
});

module.exports = router;

const express = require("express");
const router = express.Router();

// Exact data from fines.json
const fines = [
  {
    id: 1,
    type: "Overdue",
    item: "Audio Recorder",
    amount: 5,
    dueDate: "Oct 10",
    status: "Unpaid",
    ref: "F-2084"
  },
  {
    id: 2,
    type: "Damage",
    item: "Tripod",
    amount: 12,
    assessed: "Oct 11",
    status: "Unpaid",
    ref: "F-3091"
  },
  {
    id: 3,
    type: "Late",
    item: "Microphone",
    amount: 0,
    paid: "Oct 01",
    receipt: "R-1012",
    status: "Paid",
    ref: "F-1012"
  }
];

// GET /api/fines?userId=usr_001
router.get("/", (req, res) => {
  const { userId } = req.query;
  // Return format expected by frontend: { fines: [...] }
  res.json({ fines });
});

router.post("/:id/pay", (req, res) => {
  const fine = fines.find((f) => f.id === parseInt(req.params.id));
  if (!fine) return res.status(404).json({ message: "Fine not found" });
  fine.status = "paid";
  res.json({ message: "Fine paid", fine });
});

module.exports = router;

// [Task #398] Update: Enhance fines display with payment options

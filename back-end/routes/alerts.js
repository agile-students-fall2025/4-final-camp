const express = require("express");
const router = express.Router();

const alerts = [
  { id: 1, type: "overdue", message: "Item Camera is overdue by 2 days" },
];

router.get("/", (req, res) => res.json(alerts));

module.exports = router;

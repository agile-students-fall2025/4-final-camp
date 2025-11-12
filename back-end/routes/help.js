const express = require("express");
const router = express.Router();

const help = [
  { section: "Borrowing Policies", content: "Items must be returned within 7 days." },
  { section: "Support", content: "Email equipment@university.edu for help." },
];

router.get("/", (req, res) => res.json(help));

module.exports = router;

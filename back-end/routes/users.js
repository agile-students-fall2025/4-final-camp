const express = require("express");
const router = express.Router();

const users = [
  { id: 1, email: "ak@example.com", role: "student" },
  { id: 2, email: "staff@example.com", role: "staff" },
];

// GET /api/users (for staff to list all users/students) - must come before /:userId
router.get("/", (req, res) => {
  // Exact data from students.json
  const students = [
    {
      id: "stu-1024",
      name: "Sarah Johnson",
      netId: "si2356",
      email: "si2356@univ.edu",
      activeFines: [
        {
          id: 1,
          reason: "Overdue – Audio Recorder",
          amount: 5,
          status: "unpaid"
        },
        {
          id: 2,
          reason: "Damage – Tripod",
          amount: 12,
          status: "unpaid"
        }
      ]
    },
    {
      id: "stu-1048",
      name: "Leah Sullivan",
      netId: "ls1842",
      email: "ls1842@univ.edu",
      activeFines: [
        {
          id: 3,
          reason: "Overdue – Lighting Kit",
          amount: 8,
          status: "unpaid"
        }
      ]
    },
    {
      id: "stu-1082",
      name: "Michael Thompson",
      netId: "mt2201",
      email: "mt2201@univ.edu",
      activeFines: []
    }
  ];
  res.json(students);
});

// GET /api/users/:userId
router.get("/:userId", (req, res) => {
  const { userId } = req.params;
  // Exact data from profile.json
  const student = {
    name: "Student Name",
    email: "netid@univ.edu",
    campusCashBalance: 125.5,
    notificationPreferences: {
      email: true,
      sms: false,
      shareData: true
    }
  };
  res.json({ student });
});

router.post("/login", (req, res) => {
  const { email } = req.body;
  const user = users.find((u) => u.email === email);
  if (!user) return res.status(401).json({ message: "Invalid credentials" });
  res.json({ message: "Login successful", user });
});

router.post("/register", (req, res) => {
  const newUser = { id: users.length + 1, ...req.body };
  users.push(newUser);
  res.status(201).json({ message: "Registered successfully", user: newUser });
});

module.exports = router;

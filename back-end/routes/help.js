const express = require("express");
const router = express.Router();
const { optionalAuth } = require('../middleware/auth');

// This would typically come from a CMS or database
const help = [
  { 
    id: 1,
    section: "Getting Started", 
    content: "Welcome to CAMP! Browse our catalog, reserve items, and pick them up at your chosen facility." 
  },
  { 
    id: 2,
    section: "Borrowing Policies", 
    content: "Standard borrowing period is 7 days. Most items can be renewed up to 2 times. Computers have a 14-day period." 
  },
  { 
    id: 3,
    section: "Reservations", 
    content: "Reserve items up to 7 days in advance. Reservations are held for 24 hours after the scheduled pickup time." 
  },
  { 
    id: 4,
    section: "Fines & Fees", 
    content: "Late fees are $5/day for cameras, $10/day for computers, $3/day for audio equipment and accessories." 
  },
  { 
    id: 5,
    section: "Facilities", 
    content: "We have multiple pickup locations across campus including IM Lab, Media Center, Arts Centre, and Library." 
  },
  { 
    id: 6,
    section: "Support", 
    content: "For help, email equipment@university.edu or visit any of our facilities during operating hours." 
  },
  {
    id: 7,
    section: "Account Management",
    content: "Update your notification preferences and profile information in Settings. You can choose to receive reminders via email or in-app notifications."
  }
];

router.get("/", optionalAuth, (req, res) => {
  const { section } = req.query;
  
  if (section) {
    const filtered = help.filter(h => 
      h.section.toLowerCase().includes(section.toLowerCase())
    );
    return res.json(filtered);
  }
  
  res.json(help);
});

module.exports = router;

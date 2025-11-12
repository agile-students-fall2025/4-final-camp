const r = require('express').Router();

// GET /api/staff/inventory
r.get('/inventory', (_req, res) => {
  // Exact data from staff-inventory.json
  const items = [
    {
      id: 1,
      name: "DSLR Camera Kit",
      location: "IM Lab",
      assetId: "ID CAM-201",
      status: "available",
      category: "Camera",
      quantity: 3,
      condition: "Good",
      reservationWindow: 24,
      description: "Body + 18-55mm lens, 2 batteries, charger"
    },
    {
      id: 2,
      name: "Audio Recorder",
      location: "Media Center",
      assetId: "ID AUD-105",
      status: "checked-out",
      category: "Audio",
      quantity: 2,
      condition: "Good",
      reservationWindow: 48,
      description: "Zoom H4n Pro with accessories"
    },
    {
      id: 3,
      name: "Tripod",
      location: "Library",
      assetId: "ID TRI-042",
      status: "available",
      category: "Accessory",
      quantity: 5,
      condition: "Good",
      reservationWindow: 24,
      description: "Manfrotto 190 aluminum tripod"
    },
    {
      id: 4,
      name: "Microphone Stand",
      location: "Media Center",
      assetId: "ID MIC-089",
      status: "reserved",
      category: "Audio",
      quantity: 4,
      condition: "Good",
      reservationWindow: 24,
      description: "Adjustable boom stand"
    },
    {
      id: 5,
      name: "Lighting Kit",
      location: "IM Lab",
      assetId: "ID LIT-034",
      status: "reserved",
      category: "Lighting",
      quantity: 2,
      condition: "Excellent",
      reservationWindow: 48,
      description: "3-point LED lighting kit with stands"
    },
    {
      id: 6,
      name: "Video Camera",
      location: "Arts Centre",
      assetId: "ID VID-112",
      status: "maintenance",
      category: "Camera",
      quantity: 1,
      condition: "Needs Repair",
      reservationWindow: 72,
      description: "Sony FDR-AX700 4K camcorder"
    },
    {
      id: 7,
      name: "Projector",
      location: "Library",
      assetId: "ID PRJ-056",
      status: "available",
      category: "Other",
      quantity: 3,
      condition: "Good",
      reservationWindow: 24,
      description: "Epson PowerLite 1080p projector"
    },
    {
      id: 8,
      name: "Laptop - MacBook Pro",
      location: "IM Lab",
      assetId: "ID LAP-203",
      status: "checked-out",
      category: "Computer",
      quantity: 1,
      condition: "Excellent",
      reservationWindow: 168,
      description: "16\" M2 Pro, 16GB RAM, 512GB SSD"
    },
    {
      id: 9,
      name: "VR Headset - Meta Quest 3",
      location: "IM Lab",
      assetId: "ID VR-301",
      status: "available",
      category: "Electronics",
      quantity: 2,
      condition: "Excellent",
      reservationWindow: 48,
      description: "Meta Quest 3 VR headset with controllers and charging dock"
    }
  ];
  return res.status(200).json({ items });
});

// POST /api/staff/items
r.post('/items', (req, res) => {
  const { name, category, facility, status } = req.body || {};
  if (!name) return res.status(400).json({ error: 'Missing name' });
  return res.status(201).json({ ok: true, id: 'itm_new', name, category, facility, status: status || 'available' });
});

// POST /api/staff/checkout
r.post('/checkout', (req, res) => {
  const { userId, itemId } = req.body || {};
  if (!userId || !itemId) return res.status(400).json({ error: 'Missing userId or itemId' });
  return res.status(201).json({ ok: true, borrowalId: 'bor_002' });
});

// POST /api/staff/checkin
r.post('/checkin', (req, res) => {
  const { itemId } = req.body || {};
  if (!itemId) return res.status(400).json({ error: 'Missing itemId' });
  return res.status(201).json({ ok: true, itemId, status: 'available' });
});

// GET /api/staff/reservations
r.get('/reservations', (_req, res) => {
  // Exact data from staff-reservations.json
  const reservations = [
    {
      id: 1,
      item: "DSLR Camera",
      time: "2:30 PM",
      student: "Akash M.",
      location: "IM Lab",
      status: "pending"
    },
    {
      id: 2,
      item: "Tripod",
      time: "3:00 PM",
      student: "Leah S.",
      location: "Library",
      status: "ready"
    },
    {
      id: 3,
      item: "Audio Recorder",
      time: "4:15 PM",
      student: "Mike T.",
      location: "Media Center",
      status: "pending"
    },
    {
      id: 4,
      item: "Lighting Kit",
      time: "5:00 PM",
      student: "Emma W.",
      location: "IM Lab",
      status: "ready"
    },
    {
      id: 5,
      item: "Microphone Stand",
      time: "5:30 PM",
      student: "David K.",
      location: "Media Center",
      status: "pending"
    }
  ];
  return res.status(200).json({ reservations });
});

// GET /api/staff/overdue
r.get('/overdue', (_req, res) => {
  // Exact data from staff-overdue.json
  const items = [
    {
      id: 1,
      item: "Audio Recorder",
      days: 1,
      student: "J. Patel",
      dueDate: "Oct 26, 2025"
    },
    {
      id: 2,
      item: "Tripod",
      days: 3,
      student: "R. Chen",
      dueDate: "Oct 24, 2025"
    },
    {
      id: 3,
      item: "DSLR Camera",
      days: 5,
      student: "A. Martinez",
      dueDate: "Oct 22, 2025"
    },
    {
      id: 4,
      item: "Lighting Kit",
      days: 2,
      student: "S. Johnson",
      dueDate: "Oct 25, 2025"
    }
  ];
  return res.status(200).json({ items });
});

// GET /api/staff/alerts (staff dashboard)
r.get('/alerts', (_req, res) => {
  // Exact data from staff-dashboard.json
  const inventoryStats = {
    available: 126,
    out: 34,
    reserved: 18,
    checkouts: 22,
    returns: 19,
    overdue: 12
  };
  return res.status(200).json({ inventoryStats });
});

// GET /api/staff/fines
r.get('/fines', (_req, res) => res.status(200).json([]));

module.exports = r;

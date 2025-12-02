const express = require('express');
const router = express.Router();
const Borrowal = require('../models/Borrowal');
const Reservation = require('../models/Reservation');
const Fine = require('../models/Fine');
const { authenticate } = require('../middleware/auth');

router.get('/', authenticate, async (req, res) => {
  try {
    const userId = req.userId;

    const activeBorrowals = await Borrowal.countDocuments({
      user: userId,
      status: { $in: ['active', 'overdue'] }
    });

    const overdueItems = await Borrowal.countDocuments({
      user: userId,
      status: 'overdue'
    });

    const activeReservations = await Reservation.countDocuments({
      user: userId,
      status: { $in: ['pending', 'confirmed'] }
    });

    // Get unpaid fines total
    const unpaidFinesTotal = await Fine.aggregate([
      { $match: { user: userId, status: 'pending' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    const stats = [
      {
        id: "activeBorrowals",
        label: "Active Borrowals",
        value: activeBorrowals
      },
      {
        id: "overdueItems",
        label: "Overdue Items",
        value: overdueItems
      },
      {
        id: "activeReservations",
        label: "Active Reservations",
        value: activeReservations
      },
      {
        id: "unpaidFines",
        label: "Unpaid Fines",
        value: unpaidFinesTotal[0]?.total || 0
      }
    ];

    // Get upcoming due items
    const dueItemsBorrowals = await Borrowal.find({
      user: userId,
      status: { $in: ['active', 'overdue'] }
    })
      .populate({
        path: 'item',
        select: 'name facility',
        populate: { path: 'facility', select: 'name' }
      })
      .sort({ dueDate: 1 })
      .limit(5);

    const dueItems = dueItemsBorrowals.map(b => ({
      id: `borrowal-${b._id}`,
      name: b.item?.name || 'Unknown Item',
      dueDisplay: b.dueDate ? b.dueDate.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      }) : 'N/A',
      location: b.item?.facility?.name || 'Unknown Facility',
      isOverdue: b.status === 'overdue'
    }));

    res.status(200).json({
      stats,
      dueItems
    });
  } catch (error) {
    console.error('Error fetching dashboard:', error);
    res.status(500).json({ error: 'Internal Server Error', message: 'Failed to fetch dashboard' });
  }
});

module.exports = router;

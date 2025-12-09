const express = require("express");
const router = express.Router();
const Reservation = require('../models/Reservation');
const Item = require('../models/Item');
const { createNotification } = require('../utils/notificationService');
const { authenticate, authorize } = require('../middleware/auth');
const { validateReservationCreation, validateMongoId, validatePagination } = require('../middleware/validation');

// Helper to get validateMongoId middleware for 'id' param
const validateId = validateMongoId('id');

// GET /api/reservations - Get user's reservations
router.get("/", authenticate, validatePagination, async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    
    const query = { user: req.userId };
    if (status) query.status = status;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const reservations = await Reservation.find(query)
      .populate({
        path: 'item',
        select: 'name category facility imageUrl quantity quantityAvailable',
        populate: { path: 'facility', select: 'name location' }
      })
      .sort({ pickupDate: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const results = reservations.map(r => ({
      id: r._id,
      user: req.userId,
      item: r.item ? {
        id: r.item._id,
        name: r.item.name,
        category: r.item.category,
        quantity: r.item.quantity || 1,
        quantityAvailable: r.item.quantityAvailable ?? r.item.quantity ?? 1
      } : null,
      itemName: r.item?.name || 'Unknown Item',
      pickupDate: r.pickupDate,
      date: r.pickupDate ? r.pickupDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'TBD',
      time: r.pickupDate ? r.pickupDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }) : 'TBD',
      facility: r.item?.facility ? {
        id: r.item.facility._id,
        name: r.item.facility.name,
        location: r.item.facility.location
      } : null,
      facilityName: r.item?.facility?.name || 'Facility',
      status: r.status,
      expiresAt: r.expiryDate
    }));

    const total = await Reservation.countDocuments(query);

    res.json({
      reservations: results,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Error fetching reservations:', error);
    res.status(500).json({ error: 'Internal Server Error', message: 'Failed to fetch reservations' });
  }
});

// POST /api/reservations - Create a new reservation
router.post("/", authenticate, validateReservationCreation, async (req, res) => {
  try {
    const { itemId, pickupDate } = req.body;

    const item = await Item.findById(itemId);
    if (!item) {
      return res.status(404).json({ error: 'Not Found', message: 'Item not found' });
    }

    // Check if item is in maintenance or retired
    if (item.status === 'maintenance' || item.status === 'retired') {
      return res.status(400).json({ error: 'Bad Request', message: `Item is currently ${item.status}` });
    }

    // Check quantity-based availability
    const totalQty = item.quantity || 1;
    
    // Check for conflicting reservations (Time-based availability)
    const pickupAt = new Date(pickupDate);
    const reservationAt = new Date();
    const expiryDate = new Date(pickupAt.getTime() + 24 * 60 * 60 * 1000); // 24 hours

    // Get all overlapping reservations sorted by reservation date (earliest first - first-come, first-served)
    const conflictingReservations = await Reservation.find({
      item: itemId,
      status: { $in: ['pending', 'confirmed'] },
      pickupDate: { $lt: expiryDate },
      expiryDate: { $gt: pickupAt }
    }).sort({ reservationDate: 1 });

    // If all units are booked for this slot, reject
    if (conflictingReservations.length >= totalQty) {
      return res.status(409).json({ 
        error: 'Conflict', 
        message: 'All units are reserved for this time slot' 
      });
    }

    // Also check if the user already has a reservation for this item in this slot
    // (Prevent hoarding multiple units of the same item for the same time)
    const userConflict = await Reservation.findOne({
      user: req.userId,
      item: itemId,
      status: { $in: ['pending', 'confirmed'] },
      pickupDate: { $lt: expiryDate },
      expiryDate: { $gt: pickupAt }
    });

    if (userConflict) {
      return res.status(409).json({ 
        error: 'Conflict', 
        message: 'You already have a reservation for this item at this time' 
      });
    }

    const reservation = new Reservation({
      user: req.userId,
      item: itemId,
      reservationDate: reservationAt,
      pickupDate: pickupAt,
      expiryDate: expiryDate,
      status: 'confirmed'
    });

    await reservation.save();

    // Update item status only if we are now fully booked for *current* availability
    // (This is a bit loose for future dates, but keeps status consistent for "now")
    // We can skip updating item.status to 'reserved' if we rely on dynamic checks,
    // but legacy logic might depend on it.
    // Let's only set it if we are booking for "now" and run out of space.
    const now = new Date();
    if (pickupAt <= new Date(now.getTime() + 24 * 60 * 60 * 1000)) {
       const activeNow = await Reservation.countDocuments({
         item: itemId,
         status: { $in: ['pending', 'confirmed'] },
         pickupDate: { $lte: new Date(now.getTime() + 24 * 60 * 60 * 1000) },
         expiryDate: { $gte: now }
       });
       const availableQty = item.quantityAvailable ?? totalQty;
       if (availableQty <= activeNow) {
         item.status = 'reserved';
         await item.save();
       }
    }

    const populated = await reservation.populate({
      path: 'item',
      select: 'name facility',
      populate: { path: 'facility', select: 'name location' }
    });

    try {
      await createNotification({
        userId: req.userId,
        type: 'reservation',
        title: 'Reservation confirmed',
        message: `Your reservation for "${item.name}" is confirmed for ${pickupAt.toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' })}.`,
        relatedItem: item._id,
        relatedReservation: reservation._id,
        sendEmailNotification: true,
      });
    } catch (notifyErr) {
      console.error('Reservation notification failed:', notifyErr);
    }

    res.status(201).json({
      message: 'Reservation created successfully',
      reservation: populated
    });
  } catch (error) {
    console.error('Error creating reservation:', error);
    res.status(500).json({ error: 'Internal Server Error', message: 'Failed to create reservation' });
  }
});

// GET /api/reservations/slots?facility=IM%20Lab&date=2025-10-20
router.get("/slots", authenticate, async (req, res) => {
  try {
    const { facility, date } = req.query;
    
    if (!facility || !date) {
      return res.status(400).json({ error: 'Bad Request', message: 'facility and date are required' });
    }

    // Generate next 3 days
    const startDate = new Date(date);
    const dates = [];
    for (let i = 0; i < 3; i++) {
      const d = new Date(startDate);
      d.setDate(d.getDate() + i);
      dates.push(d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
    }

    // Standard time blocks
    const timeBlocks = ["10:00-12:00", "14:00-16:00", "16:00-18:00"];

    res.status(200).json({ dates, timeBlocks });
  } catch (error) {
    console.error('Error fetching slots:', error);
    res.status(500).json({ error: 'Internal Server Error', message: 'Failed to fetch slots' });
  }
});

// PUT /api/reservations/:id/cancel - Cancel a reservation
router.put("/:id/cancel", authenticate, validateId, async (req, res) => {
  try {
    const { id } = req.params;

    const reservation = await Reservation.findById(id);
    if (!reservation) {
      return res.status(404).json({ error: 'Not Found', message: 'Reservation not found' });
    }

    if (reservation.user.toString() !== req.userId.toString() && !['staff', 'admin'].includes(req.userRole)) {
      return res.status(403).json({ error: 'Forbidden', message: 'Access denied' });
    }

    if (reservation.status === 'cancelled') {
      return res.status(400).json({ error: 'Bad Request', message: 'Reservation already cancelled' });
    }

    reservation.status = 'cancelled';
    await reservation.save();

    const item = await Item.findById(reservation.item);
    if (item && item.status === 'reserved') {
      item.status = 'available';
      await item.save();
    }

    try {
      await createNotification({
        userId: reservation.user,
        type: 'reservation',
        title: 'Reservation cancelled',
        message: `Your reservation for "${item?.name || 'your item'}" has been cancelled.`,
        relatedItem: reservation.item,
        relatedReservation: reservation._id,
        sendEmailNotification: true,
      });
    } catch (notifyErr) {
      console.error('Reservation cancel notification failed:', notifyErr);
    }

    res.json({ message: 'Reservation cancelled successfully', reservation });
  } catch (error) {
    console.error('Error cancelling reservation:', error);
    res.status(500).json({ error: 'Internal Server Error', message: 'Failed to cancel reservation' });
  }
});

module.exports = router;

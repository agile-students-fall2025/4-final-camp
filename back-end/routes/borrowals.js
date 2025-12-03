const express = require('express');
const r = express.Router();
const Borrowal = require('../models/Borrowal');
const Item = require('../models/Item');
const User = require('../models/User');
const { authenticate, authorize } = require('../middleware/auth');
const { validateBorrowalCreation, validateMongoId, validatePagination } = require('../middleware/validation');

// Helper to get validateMongoId middleware for 'id' param
const validateId = validateMongoId('id');

// GET /api/borrowals - Get current and history for user
r.get('/', authenticate, async (req, res) => {
  try {
    const userId = req.userId;

    // Active / overdue borrowals
    const activeBorrowals = await Borrowal.find({
      user: userId,
      status: { $in: ['active', 'overdue'] }
    })
      .populate({
        path: 'item',
        select: 'name category facility imageUrl',
        populate: { path: 'facility', select: 'name location' }
      })
      .sort({ checkoutDate: -1 })
      .limit(20);

    const current = activeBorrowals.map(b => ({
      id: b._id,
      name: b.item?.name || 'Unknown Item',
      dueDate: b.dueDate ? b.dueDate.toLocaleDateString('en-US', {
        month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true
      }) : 'N/A',
      location: b.item?.facility?.name || 'Unknown Facility',
      status: b.status === 'overdue' ? 'Overdue' : 'Active'
    }));

    // Returned history
    const returnedBorrowals = await Borrowal.find({
      user: userId,
      status: 'returned'
    })
      .populate({
        path: 'item',
        select: 'name category facility imageUrl',
        populate: { path: 'facility', select: 'name location' }
      })
      .sort({ returnDate: -1 })
      .limit(20);

    const history = returnedBorrowals.map(b => ({
      id: b._id,
      name: b.item?.name || 'Unknown Item',
      returnDate: b.returnDate ? b.returnDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A',
      location: b.item?.facility?.name || 'Unknown Facility',
      status: 'Returned'
    }));

    res.status(200).json({ current, history });
  } catch (error) {
    console.error('Error fetching borrowals:', error);
    res.status(500).json({ error: 'Internal Server Error', message: 'Failed to fetch borrowals' });
  }
});

// GET /api/borrowals/overdue - Get overdue items (staff only)
r.get('/overdue', authenticate, authorize('staff', 'admin'), async (req, res) => {
  try {
    const borrowals = await Borrowal.find({ status: 'overdue' })
      .populate('user', 'firstName lastName netId email')
      .populate('item', 'name category')
      .populate('facility', 'name')
      .sort({ dueDate: 1 })
      .limit(50);

    const overdue = borrowals.map(b => ({
      id: b._id,
      user: {
        id: b.user._id,
        name: b.user.fullName,
        netId: b.user.netId,
        email: b.user.email
      },
      item: b.item.name,
      category: b.item.category,
      facility: b.facility.name,
      dueDate: b.dueDate.toISOString().split('T')[0],
      daysOverdue: b.daysOverdue
    }));

    res.json({ overdue });
  } catch (error) {
    console.error('Error fetching overdue borrowals:', error);
    res.status(500).json({ 
      error: 'Internal Server Error', 
      message: 'Failed to fetch overdue borrowals' 
    });
  }
});

// POST /api/borrowals/checkout - Check out an item (staff only)
// POST /api/borrowals/checkout - Check out an item (staff only)
r.post('/checkout', authenticate, authorize('staff', 'admin'), validateBorrowalCreation, async (req, res) => {
  try {
    const { userId, itemId, dueDate } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'Not Found', message: 'User not found' });
    }

    const item = await Item.findById(itemId);
    if (!item) {
      return res.status(404).json({ error: 'Not Found', message: 'Item not found' });
    }

    if (item.status !== 'available') {
      return res.status(400).json({ error: 'Bad Request', message: `Item is currently ${item.status}` });
    }

    const borrowal = new Borrowal({
      user: userId,
      item: itemId,
      checkoutDate: new Date(),
      dueDate: new Date(dueDate),
      checkedOutBy: req.userId
    });

    await borrowal.save();

    item.status = 'checked-out';
    await item.save();

    res.status(201).json({
      message: 'Item checked out successfully',
      borrowal: await borrowal.populate({
        path: 'item',
        select: 'name category facility',
        populate: { path: 'facility', select: 'name location' }
      })
    });
  } catch (error) {
    console.error('Error checking out item:', error);
    res.status(500).json({ error: 'Internal Server Error', message: 'Failed to check out item' });
  }
});

// PUT /api/borrowals/:id/return - Return an item (staff only)
// PUT /api/borrowals/:id/return - Return an item (staff only)
r.put('/:id/return', authenticate, authorize('staff', 'admin'), validateId, async (req, res) => {
  try {
    const { id } = req.params;
    const { condition, notes } = req.body;

    const borrowal = await Borrowal.findById(id);
    if (!borrowal) {
      return res.status(404).json({ error: 'Not Found', message: 'Borrowal not found' });
    }

    if (borrowal.status === 'returned') {
      return res.status(400).json({ error: 'Bad Request', message: 'Item already returned' });
    }

    borrowal.status = 'returned';
    borrowal.returnDate = new Date();
    borrowal.conditionOnReturn = condition || 'good';
    if (notes) borrowal.notes = notes;

    await borrowal.save();

    const item = await Item.findById(borrowal.item);
    if (item) {
      item.status = 'available';
      await item.save();
    }

    res.json({
      message: 'Item returned successfully',
      borrowal: await borrowal.populate({
        path: 'item',
        select: 'name category facility',
        populate: { path: 'facility', select: 'name location' }
      })
    });
  } catch (error) {
    console.error('Error returning item:', error);
    res.status(500).json({ error: 'Internal Server Error', message: 'Failed to return item' });
  }
});

// PUT /api/borrowals/:id/renew - Renew a borrowal
// PUT /api/borrowals/:id/renew - Renew a borrowal (simple extension)
r.put('/:id/renew', authenticate, validateId, async (req, res) => {
  try {
    const { id } = req.params;

    const borrowal = await Borrowal.findById(id);
    if (!borrowal) {
      return res.status(404).json({ error: 'Not Found', message: 'Borrowal not found' });
    }

    if (borrowal.user.toString() !== req.userId.toString() && !['staff', 'admin'].includes(req.userRole)) {
      return res.status(403).json({ error: 'Forbidden', message: 'Access denied' });
    }

    if (borrowal.status !== 'active') {
      return res.status(400).json({ error: 'Bad Request', message: `Cannot renew ${borrowal.status} borrowal` });
    }
    // Simple 7-day extension
    borrowal.dueDate = new Date(borrowal.dueDate.getTime() + 7 * 24 * 60 * 60 * 1000);

    await borrowal.save();

    res.json({
      message: 'Borrowal renewed successfully',
      borrowal: await borrowal.populate({
        path: 'item',
        select: 'name category facility',
        populate: { path: 'facility', select: 'name location' }
      })
    });
  } catch (error) {
    console.error('Error renewing borrowal:', error);
    res.status(500).json({ error: 'Internal Server Error', message: 'Failed to renew borrowal' });
  }
});

module.exports = r;

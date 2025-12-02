const express = require("express");
const router = express.Router();
const Item = require('../models/Item');
const Facility = require('../models/Facility');
const Borrowal = require('../models/Borrowal');
const Reservation = require('../models/Reservation');
const { authenticate, authorize, optionalAuth } = require('../middleware/auth');
const { validateItemCreation, validateItemUpdate, validateMongoId, validatePagination } = require('../middleware/validation');

// Helper to get validateMongoId middleware for 'id' param
const validateId = validateMongoId('id');

// GET /api/items - Get all items with optional filtering and pagination
router.get("/", optionalAuth, validatePagination, async (req, res) => {
  try {
    const { 
      category, 
      facility, 
      status, 
      search, 
      page = 1, 
      limit = 50 
    } = req.query;

    // Build query
    const query = { isActive: true };
    
    if (category && category !== 'All') {
      query.category = category;
    }
    
    if (facility && facility !== 'All') {
      query.facility = facility;
    }
    
    if (status && status !== 'All') {
      query.status = status === 'Available' ? 'available' : 
                     status === 'Reserved' ? 'reserved' : 
                     status.toLowerCase();
    }
    
    if (search) {
      query.$text = { $search: search };
    }

    // Execute query with pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const items = await Item.find(query)
      .populate('facility', 'name location')
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await Item.countDocuments(query);

    // Compute availableQuantity for each item based on active borrowals/reservations
    const itemsWithQuantity = await Promise.all(items.map(async (item) => {
      const itemObj = item.toObject();
      const totalQty = itemObj.quantity || 1;
      
      // Count active borrowals for this item
      const activeBorrowals = await Borrowal.countDocuments({
        item: item._id,
        status: { $in: ['active', 'overdue'] }
      });
      
      // Count active reservations for this item
      const activeReservations = await Reservation.countDocuments({
        item: item._id,
        status: 'active'
      });
      
      const availableQty = Math.max(0, totalQty - activeBorrowals - activeReservations);
      
      return {
        ...itemObj,
        quantity: totalQty,
        availableQuantity: availableQty
      };
    }));

    // Get distinct categories and facilities for filters
    const categories = await Item.distinct('category');
    const facilities = await Facility.find({ isActive: true }).select('_id name');

    const filters = {
      categories: ['All', ...categories],
      facilities: ['All', ...facilities.map(f => f.name)],
      availabilities: ['All', 'Available', 'Reserved', 'Checked-out', 'Maintenance']
    };

    res.json({ 
      items: itemsWithQuantity,
      filters,
      facilities,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Error fetching items:', error);
    res.status(500).json({ 
      error: 'Internal Server Error', 
      message: 'Failed to fetch items' 
    });
  }
});

// GET /api/items/:id - Get single item by ID
router.get("/:id", validateId, async (req, res) => {
  try {
    const item = await Item.findById(req.params.id)
      .populate('facility', 'name location contactEmail contactPhone operatingHours');

    if (!item || !item.isActive) {
      return res.status(404).json({ 
        error: 'Not Found',
        message: 'Item not found' 
      });
    }

    // Compute availableQuantity
    const totalQty = item.quantity || 1;
    const activeBorrowals = await Borrowal.countDocuments({
      item: item._id,
      status: { $in: ['active', 'overdue'] }
    });
    const activeReservations = await Reservation.countDocuments({
      item: item._id,
      status: 'active'
    });
    const availableQty = Math.max(0, totalQty - activeBorrowals - activeReservations);

    const itemObj = item.toObject();
    res.json({
      ...itemObj,
      quantity: totalQty,
      availableQuantity: availableQty
    });
  } catch (error) {
    console.error('Error fetching item:', error);
    res.status(500).json({ 
      error: 'Internal Server Error', 
      message: 'Failed to fetch item' 
    });
  }
});

// GET /api/items/facility/:name - Get items by facility name
router.get("/facility/:name", async (req, res) => {
  try {
    const facilityName = req.params.name.replace(/-/g, ' ');
    const facility = await Facility.findOne({ 
      name: new RegExp(facilityName, 'i'),
      isActive: true 
    });

    if (!facility) {
      return res.status(404).json({ 
        error: 'Not Found',
        message: 'Facility not found' 
      });
    }

    const items = await Item.find({ 
      facility: facility._id, 
      isActive: true 
    }).populate('facility', 'name location');

    res.json(items);
  } catch (error) {
    console.error('Error fetching items by facility:', error);
    res.status(500).json({ 
      error: 'Internal Server Error', 
      message: 'Failed to fetch items' 
    });
  }
});

// POST /api/items - Create new item (staff/admin only)
router.post("/", authenticate, authorize('staff', 'admin'), validateItemCreation, async (req, res) => {
  try {
    const item = new Item(req.body);
    await item.save();
    await item.populate('facility', 'name location');

    res.status(201).json({
      message: 'Item created successfully',
      item
    });
  } catch (error) {
    console.error('Error creating item:', error);
    res.status(500).json({ 
      error: 'Internal Server Error', 
      message: 'Failed to create item' 
    });
  }
});

// PUT /api/items/:id - Update item (staff/admin only)
router.put("/:id", authenticate, authorize('staff', 'admin'), validateItemUpdate, async (req, res) => {
  try {
    const item = await Item.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('facility', 'name location');

    if (!item) {
      return res.status(404).json({ 
        error: 'Not Found',
        message: 'Item not found' 
      });
    }

    res.json({
      message: 'Item updated successfully',
      item
    });
  } catch (error) {
    console.error('Error updating item:', error);
    res.status(500).json({ 
      error: 'Internal Server Error', 
      message: 'Failed to update item' 
    });
  }
});

// DELETE /api/items/:id - Soft delete item (staff/admin only)
router.delete("/:id", authenticate, authorize('staff', 'admin'), validateId, async (req, res) => {
  try {
    const item = await Item.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!item) {
      return res.status(404).json({ 
        error: 'Not Found',
        message: 'Item not found' 
      });
    }

    res.json({
      message: 'Item deleted successfully',
      item
    });
  } catch (error) {
    console.error('Error deleting item:', error);
    res.status(500).json({ 
      error: 'Internal Server Error', 
      message: 'Failed to delete item' 
    });
  }
});

module.exports = router;

// [Task #502] Update: Modify item management routes

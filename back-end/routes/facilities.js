// routes/facilities.js
const express = require('express');
const router = express.Router();
const Facility = require('../models/Facility');
const Item = require('../models/Item');
const { optionalAuth } = require('../middleware/auth');
const { validatePagination } = require('../middleware/validation');

// GET /api/facilities
router.get('/', optionalAuth, async (req, res) => {
  try {
    const facilities = await Facility.find({ isActive: true })
      .select('name location operatingHours description')
      .sort({ name: 1 });

    const results = facilities.map(f => ({
      slug: f.name.toLowerCase().replace(/\s+/g, '-'),
      name: f.name,
      location: f.location,
      hours: f.operatingHours,
      description: f.description
    }));

    res.status(200).json(results);
  } catch (error) {
    console.error('Error fetching facilities:', error);
    res.status(500).json({ error: 'Internal Server Error', message: 'Failed to fetch facilities' });
  }
});

// GET /api/facilities/:slug/items
router.get('/:slug/items', optionalAuth, validatePagination, async (req, res) => {
  try {
    const { slug } = req.params;
    const { category, status, page = 1, limit = 50 } = req.query;

    // Convert slug to facility name
    const facilityName = slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    
    const facility = await Facility.findOne({ 
      name: new RegExp(`^${facilityName}$`, 'i'),
      isActive: true 
    });

    if (!facility) {
      return res.status(404).json({ error: 'Not Found', message: 'Facility not found' });
    }

    const query = { facility: facility._id, isActive: true };
    if (category) query.category = category;
    if (status) query.status = status;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const items = await Item.find(query)
      .select('name category status description imageUrl')
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ name: 1 });

    const results = items.map(item => ({
      id: item._id,
      name: item.name,
      category: item.category,
      facility: facility.name,
      status: item.status,
      description: item.description,
      imageUrl: item.imageUrl
    }));

    const total = await Item.countDocuments(query);

    res.status(200).json({
      items: results,
      facility: {
        name: facility.name,
        location: facility.location
      },
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Error fetching facility items:', error);
    res.status(500).json({ error: 'Internal Server Error', message: 'Failed to fetch items' });
  }
});

module.exports = router;

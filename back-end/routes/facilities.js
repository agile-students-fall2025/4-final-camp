// routes/facilities.js
const express = require('express');
const router = express.Router();

const facilities = [
  { slug: 'im-lab', name: 'IM Lab' },
  { slug: 'media-center', name: 'Media Center' },
];

// simple demo catalog by facility
const itemsByFacility = {
  'im-lab': [
    { id: 'itm_1234', name: 'Canon EOS R10', category: 'Electronics', facility: 'IM Lab', status: 'available' },
  ],
  'media-center': [],
};

// GET /api/facilities
router.get('/', (_req, res) => res.status(200).json(facilities));

// GET /api/facilities/:slug/items
router.get('/:slug/items', (req, res) => {
  const items = itemsByFacility[req.params.slug] || [];
  res.status(200).json(items);
});

module.exports = router;

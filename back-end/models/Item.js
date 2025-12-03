const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
    enum: ['Camera', 'Laptop', 'Lab Equipment', 'Sports Gear', 'Musical Instrument', 'Other'],
  },
  facility: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Facility',
    required: true,
  },
  status: {
    type: String,
    enum: ['available', 'checked-out', 'reserved', 'maintenance', 'retired'],
    default: 'available',
  },
  quantity: {
    type: Number,
    default: 1,
    min: 0,
  },
  quantityAvailable: {
    type: Number,
    default: 1,
    min: 0,
  },
  condition: {
    type: String,
    enum: ['excellent', 'good', 'fair', 'poor', 'damaged', 'needs-repair'],
    default: 'good',
  },
  assetId: {
    type: String,
    unique: true,
    sparse: true,
  },
  serialNumber: {
    type: String,
    unique: true,
    sparse: true,
  },
  purchaseDate: {
    type: Date,
  },
  value: {
    type: Number,
    min: 0,
  },
  imageUrl: {
    type: String,
    default: null,
  },
  tags: [{
    type: String,
    trim: true,
  }],
  isActive: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

// Indexes
itemSchema.index({ facility: 1, status: 1 });
itemSchema.index({ category: 1 });
itemSchema.index({ name: 'text', description: 'text', tags: 'text' });

module.exports = mongoose.model('Item', itemSchema);

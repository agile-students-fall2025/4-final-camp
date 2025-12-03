const mongoose = require('mongoose');

const facilitySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  description: {
    type: String,
    required: true,
  },
  location: {
    building: {
      type: String,
      required: true,
    },
    room: {
      type: String,
      required: true,
    },
    floor: {
      type: String,
    },
  },
  contactEmail: {
    type: String,
    required: true,
    lowercase: true,
  },
  contactPhone: {
    type: String,
    required: true,
  },
  operatingHours: {
    monday: { open: String, close: String },
    tuesday: { open: String, close: String },
    wednesday: { open: String, close: String },
    thursday: { open: String, close: String },
    friday: { open: String, close: String },
    saturday: { open: String, close: String },
    sunday: { open: String, close: String },
  },
  managers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  isActive: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

// Index for searching
facilitySchema.index({ name: 'text', description: 'text' });

module.exports = mongoose.model('Facility', facilitySchema);

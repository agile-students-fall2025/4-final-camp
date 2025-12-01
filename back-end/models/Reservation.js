const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  item: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Item',
    required: true,
  },
  reservationDate: {
    type: Date,
    required: true,
  },
  pickupDate: {
    type: Date,
    required: true,
  },
  expiryDate: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'picked-up', 'fulfilled', 'cancelled', 'expired'],
    default: 'pending',
  },
  fulfilledAt: {
    type: Date,
    default: null,
  },
  notes: {
    type: String,
    default: '',
  },
  cancelledAt: {
    type: Date,
    default: null,
  },
  cancelledBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  },
  cancellationReason: {
    type: String,
    default: '',
  },
}, {
  timestamps: true,
});

// Indexes
reservationSchema.index({ user: 1, status: 1 });
reservationSchema.index({ item: 1, status: 1 });
reservationSchema.index({ pickupDate: 1 });
reservationSchema.index({ expiryDate: 1, status: 1 });

// Virtual to check if reservation is still valid
reservationSchema.virtual('isValid').get(function() {
  return this.status === 'confirmed' && new Date() < this.expiryDate;
});

reservationSchema.set('toJSON', { virtuals: true });
reservationSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Reservation', reservationSchema);

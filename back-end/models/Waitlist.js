const mongoose = require('mongoose');

const waitlistSchema = new mongoose.Schema({
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
  status: {
    type: String,
    enum: ['waiting', 'notified', 'expired', 'cancelled'],
    default: 'waiting',
  },
  position: {
    type: Number,
    required: true,
  },
  notifiedAt: {
    type: Date,
    default: null,
  },
  expiresAt: {
    type: Date,
    default: null,
  },
}, {
  timestamps: true,
});

// Indexes
waitlistSchema.index({ item: 1, status: 1, position: 1 });
waitlistSchema.index({ user: 1, status: 1 });

module.exports = mongoose.model('Waitlist', waitlistSchema);

const mongoose = require('mongoose');

const borrowalSchema = new mongoose.Schema({
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
  checkoutDate: {
    type: Date,
    required: true,
    default: Date.now,
  },
  dueDate: {
    type: Date,
    required: true,
  },
  returnDate: {
    type: Date,
    default: null,
  },
  status: {
    type: String,
    enum: ['active', 'returned', 'overdue', 'lost'],
    default: 'active',
  },
  checkedOutBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  checkedInBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  },
  notes: {
    type: String,
    default: '',
  },
  conditionOnReturn: {
    type: String,
    enum: ['excellent', 'good', 'fair', 'poor', 'damaged'],
    default: null,
  },
}, {
  timestamps: true,
});

// Indexes
borrowalSchema.index({ user: 1, status: 1 });
borrowalSchema.index({ item: 1, status: 1 });
borrowalSchema.index({ dueDate: 1, status: 1 });
borrowalSchema.index({ checkoutDate: -1 });

// Virtual for days borrowed
borrowalSchema.virtual('daysBorrowed').get(function() {
  const end = this.returnDate || new Date();
  const start = this.checkoutDate;
  return Math.floor((end - start) / (1000 * 60 * 60 * 24));
});

// Virtual for days overdue
borrowalSchema.virtual('daysOverdue').get(function() {
  if (this.status !== 'overdue' && this.status !== 'active') return 0;
  const now = new Date();
  if (now <= this.dueDate) return 0;
  return Math.floor((now - this.dueDate) / (1000 * 60 * 60 * 24));
});

borrowalSchema.set('toJSON', { virtuals: true });
borrowalSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Borrowal', borrowalSchema);

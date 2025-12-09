const express = require('express');
const r = express.Router();
const Fine = require('../models/Fine');
const { createNotification } = require('../utils/notificationService');
const { authenticate } = require('../middleware/auth');
const { validateMongoId } = require('../middleware/validation');

// POST /api/payments/:fineId/pay
r.post('/:fineId/pay', authenticate, validateMongoId('fineId'), async (req, res) => {
  try {
    const { fineId } = req.params;
    const { method, last4, name, email } = req.body || {};
    
    if (!method || !name) {
      return res.status(400).json({ error: 'Missing payment fields' });
    }

    const fine = await Fine.findById(fineId)
      .populate('user', 'email firstName lastName notificationPreferences')
      .populate('item', 'name');
    
    if (!fine) {
      return res.status(404).json({ error: 'Not Found', message: 'Fine not found' });
    }

    if (fine.user.toString() !== req.userId.toString()) {
      return res.status(403).json({ error: 'Forbidden', message: 'Access denied' });
    }

    if (fine.status === 'paid') {
      return res.status(400).json({ error: 'Bad Request', message: 'Fine already paid' });
    }

    fine.status = 'paid';
    fine.paidAt = new Date();
    fine.paymentMethod = method;
    fine.receiptNumber = `R-${Date.now()}`;

    await fine.save();

    try {
      await createNotification({
        userId: fine.user?._id || req.userId,
        type: 'fine',
        title: 'Payment received',
        message: `Payment received for fine ${fine.receiptNumber}. Amount: $${(fine.amount || 0).toFixed(2)}.`,
        relatedItem: fine.item?._id,
        relatedBorrowal: fine.borrowal,
      });
    } catch (notifyErr) {
      console.error('Payment notification failed:', notifyErr);
    }

    return res.status(201).json({ 
      ok: true, 
      fineId: fine._id, 
      receiptId: fine.receiptNumber,
      amount: fine.amount,
      paidAt: fine.paidAt
    });
  } catch (error) {
    console.error('Error processing payment:', error);
    res.status(500).json({ error: 'Internal Server Error', message: 'Failed to process payment' });
  }
});

// GET /api/payments/history - Get payment history for user
r.get('/history', authenticate, async (req, res) => {
  try {
    const fines = await Fine.find({
      user: req.userId,
      status: 'paid'
    })
      .sort({ paidAt: -1 })
      .limit(50);

    const payments = fines.map(f => ({
      id: f._id,
      receipt: f.receiptNumber || `R-${f._id}`,
      amount: f.amount || 0,
      date: f.paidAt ? f.paidAt.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A',
      method: f.paymentMethod === 'campus-cash' ? 'Campus Cash' : 
              f.paymentMethod === 'credit-card' ? 'Credit Card' : 
              f.paymentMethod || 'Other'
    }));

    return res.status(200).json({ payments });
  } catch (error) {
    console.error('Error fetching payment history:', error);
    res.status(500).json({ error: 'Internal Server Error', message: 'Failed to fetch payment history' });
  }
});

module.exports = r;

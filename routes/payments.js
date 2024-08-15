const express = require('express');
const router = express.Router();
const Payment = require('../models/Payment');
const Order = require('../models/Order');
const { auth, adminAuth } = require('../middleware/auth');

// Create a new payment
router.post('/create', auth, async (req, res, next) => {
    const { orderId, amount, paymentMethod, transactionId } = req.body;
    try {
        const order = await Order.findById(orderId);
    
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        const payment = new Payment({
            user: req.user.id,
            order: orderId,
            amount,
            paymentMethod,
            transactionId,
            status: 'Pending',
        });

        await payment.save();
        res.status(201).json({ message: 'Payment created successfully', payment });
    } catch (error) {
        next(error);
    }
});


// Get all payments (Admin only)
router.get('/', adminAuth, async (req, res, next) => {
    try {
        const payments = await Payment.find()
            .populate('user', 'name email')
            .populate('order');
        res.status(200).json(payments);
    } catch (error) {
        next(error);
    }
});

// Get user's payments
router.get('/mypayments', auth, async (req, res, next) => {
    try {
        const payments = await Payment.find({ user: req.user.id })
            .populate('order');
        res.status(200).json(payments);
    } catch (error) {
        next(error);
    }
});

// Update payment status (Admin only)
router.put('/:paymentId/status', adminAuth, async (req, res, next) => {
    const { status } = req.body;
    try {
        const payment = await Payment.findByIdAndUpdate(
            req.params.paymentId,
            { status },
            { new: true }
        );
        if (!payment) {
            return res.status(404).json({ message: 'Payment not found' });
        }
        res.status(200).json({ message: 'Payment status updated successfully', payment });
    } catch (error) {
        next(error);
    }
});

// Delete a payment (Admin only)
router.delete('/:paymentId', adminAuth, async (req, res, next) => {
    try {
        const payment = await Payment.findByIdAndDelete(req.params.paymentId);
        if (!payment) {
            return res.status(404).json({ message: 'Payment not found' });
        }
        res.status(200).json({ message: 'Payment deleted successfully' });
    } catch (error) {
        next(error);
    }
});

module.exports = router;
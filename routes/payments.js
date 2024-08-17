const express = require('express');
const router = express.Router();
const Payment = require('../models/Payment');
const Order = require('../models/Order');
const { auth, adminAuth } = require('../middleware/auth');
const {client} = require('../config/paypal');
const { NotFoundError } = require('../errors');
const checkoutNodeJssdk = require('@paypal/checkout-server-sdk');



//payment with paypal
router.post('/create-payment', auth, async (req, res, next) => {
    const { orderId, amount } = req.body;

    try {
        const order = await Order.findById(orderId);
        if (!order) {
            throw new NotFoundError('Order not found');
        }

        const request = new checkoutNodeJssdk.orders.OrdersCreateRequest();
        request.prefer("return=representation");
        request.requestBody({
            intent: 'CAPTURE',
            purchase_units: [{
                amount: {
                    currency_code: 'USD',
                    value: amount
                }
            }]
        });

        const orderResult = await client.execute(request);
        res.status(201).json({ orderID: orderResult.result.id });
    } catch (error) {
        next(error);
    }
});

//pay pal capture payment
router.post('/capture-payment', auth, async (req, res, next) => {
    const { orderID } = req.body;

    try {
        const request = new checkoutNodeJssdk.orders.OrdersCaptureRequest(orderID);
        request.requestBody({});
        const captureResult = await client.execute(request);

        // Save payment details to the database
        const payment = new Payment({
            user: req.user.id,
            order: captureResult.result.purchase_units[0].payments.captures[0].id,
            amount: captureResult.result.purchase_units[0].amount.value,
            paymentMethod: 'PayPal',
            transactionId: captureResult.result.purchase_units[0].payments.captures[0].id,
            status: 'Completed'
        });

        await payment.save();

        res.status(201).json({ message: 'Payment captured successfully', payment });
    } catch (error) {
        next(error);
    }
});
/****PAY PAL  */

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
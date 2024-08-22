const express = require('express');
const router = express.Router()
const Notification = require('../models/notification');
const { auth } = require('../middleware/auth');
const User = require('../models/User');
const { NotFoundError, ConflictError } = require('../errors');

//get notification
router.get('/', auth, async (req, res, next) => {
    try {
        const notifications = await Notification.find({ user: req.user.id })
            .sort({ createdAt: -1 })
            .populate('orderId')
            .populate('user')
        res.json(notifications);
    } catch (error) {
        next(error)
    }
});

//unread
router.get('/not-read-yet', auth, async (req, res, next) => {
    try {
        const notifications = await Notification.find({ user: req.user.id, isRead: false })
            .sort({ createdAt: -1 })
            .populate('orderId')
            .populate('user')
        res.json(notifications);
    } catch (error) {
        next(error)
    }
});


//read notification
router.put('/read-notification/:notificaionID', auth, async (req, res, next) => {
    const user = await User.findById(req.user.id);
    const { notificaionID } = req.params;

    if (!user) {
        throw new NotFoundError('No user was found with provided id..');
    }

    try {
        const notification = await Notification.findOne({ _id: notificaionID, user: req.user.id });
        if (notification.isRead) {
            throw new ConflictError('Notification is read already');
        }
        notification.isRead = true;
        await notification.save();

        const notReadNotifications = await Notification.find({ user: req.user.id, isRead: false })
            .sort({ createdAt: -1 })
            .populate('orderId')
            .populate('user')

        const notifications = await Notification.find({ user: req.user.id, isRead: true })
            .sort({ createdAt: -1 })
            .populate('orderId')
            .populate('user')

        res.status(200).json({
            msg: 'updated',
            notRead: notReadNotifications,
            read: notifications
        });

    } catch (error) {
        next(error);
    }
});


module.exports = router;
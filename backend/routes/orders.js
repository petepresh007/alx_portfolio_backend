const express = require('express');
const router = express.Router();
const { NotFoundError, BadrequestError } = require('../errors');
const { auth, adminAuth } = require('../middleware/auth');
const User = require('../models/User');
const Order = require('../models/Order');
const Admin = require('../models/Admin');
const { sendMail } = require('../middleware/sendEmail');
require("dotenv").config();
const Notification = require('../models/notification');



/**ORDER ITEM */
/**ROUTE post api/order/place-order */
/**protected */
router.post('/place-order', auth, async function (req, res, next) {
    const {
        items,
        restaurant,
        protein,
        quantity,
        totalAmount,
        deliveryAddress,
        paymentMethod,
        pack
    } = req.body;


    const user = await User.findById(req.user.id);

    if (!user) {
        throw new NotFoundError('No user was found with the provided id')
    }

    const allowedPaymentMethods = [
        'Card',
        'Cash',
        'Online'
    ]

    const allowedPacks = [
        'Big Pack',
        'Branded Pack'
    ]

    try {
        if (!items || items.length === 0) {
            throw new BadrequestError('No items in the order');
        }
        //if (!restaurant || restaurant.length === 0)


        if (!restaurant || !totalAmount || !deliveryAddress || !allowedPaymentMethods.includes(paymentMethod) || !allowedPacks.includes(pack)) {
            throw new BadrequestError('fill the provided feilds accurately to place an order');
        }

        const newOrder = new Order({
            user: req.user.id,
            items,
            restaurant,
            protein,
            quantity,
            totalAmount,
            deliveryAddress,
            paymentMethod,
            pack
        })

        if (newOrder) {
            await newOrder.save();
            const to = user.email;
            const from = process.env.SMTP_MAIL
            const subject = `Hi ${user.name}`;
            const message = `
                Your order with id: ${newOrder._id} has been successfully recieved.<br>
                if confirmed, you will be notified. 
            `

            const newNotification = new Notification({
                user: req.user.id,
                message: `Your order #${newOrder._id} has been recieved.`,
                type: 'order_received',
                orderId: newOrder._id
            });

            await newNotification.save()

            await sendMail(from, to, subject, message);
            res.status(201).json({ msg: newOrder });
        }

    } catch (error) {
        next(error);
    }
});


/**All user orders */
router.get('/my-orders', auth, async (req, res, next) => {
    const user = await User.findById(req.user.id);

    if (!user) {
        throw new NotFoundError('No user was found with the provided id.')
    }

    try {
        const orders = await Order.find({ user: req.user.id, status: "Confirmed" })
            .populate('user', 'name email')
            .populate('items.menuItem', 'name price')
            .populate('restaurant', 'name address')
            .sort({ orderDate: -1 });
        res.json(orders);
    } catch (err) {
        next(err);
    }
});



// Update order status
router.put('/update-status/:orderId', auth, async (req, res, next) => {
    const { status } = req.body;
    try {
        const order = await Order.findById(req.params.orderId);
        if (!order) {
            throw new NotFoundError('Order not found')
        }

        order.status = status;
        await order.save();
        res.status(200).json(order);
    } catch (err) {
        next(err);
    }
});


/**ADMIN ORDERS*/
//approve order
router.put('/approver-user-order/:orderId', adminAuth, async function (req, res, next) {
    const { orderId } = req.params;

    const admin = await Admin.findById(req.admin.id);
    if (!admin) {
        throw new NotFoundError(`No admin was found with the supplied id: ${orderId}`);
    }

    try {
        const order = await Order.findById(orderId);
        if (!order) {
            throw new NotFoundError('No order was found with the provided id...')
        }
        const user = await User.findById(order.user);
        if (!user) {
            throw new NotFoundError('No user was found with the provded id..')
        }

        if (order.status === 'Confirmed') {
            return res.status(200).json({ msg: `order has already been approved...` })
        }
        order.status = 'Confirmed';
        await order.save();
        const data = await Order.find({})
            .sort({ createdAt: -1 });

        //await newOrder.save();
        const to = user.email;
        const from = process.env.SMTP_MAIL
        const subject = `Hi ${user.name}`;
        const message = `
                Your order with id: ${order._id} your order has been approved.<br>
                you will be contacted very soon. 
            `
        await sendMail(from, to, subject, message)
        res.status(200).json({ msg: `order confirmed`, data: data })
    } catch (error) {
        next(error);
    }
});


//delete order admin
router.delete('/del/:id', adminAuth, async (req, res, next) => {
    const admin = await User.findById(req.admin.id);
    if (!admin) {
        throw new NotFoundError('No user was found with the supplied id')
    }
    try {
        const delorder = await Order.findOneAndDelete({ _id: req.params.id });
        if (delorder) {
            const data = await Order.find({})
                .sort({ orderDate: -1 });
            res.status(200).json({ msg: 'deleted successfully', data: data });
        }
    } catch (error) {
        next(error);
    }
});

//delete order user
router.delete('/user-del/:id', auth, async (req, res, next) => {
    const user = await User.findById(req.user.id);
    if (!user) {
        throw new NotFoundError('No user was found with the supplied id')
    }
    try {
        const delorder = await Order.findOneAndDelete({ user: req.user.id, _id: req.params.id });
        if (delorder) {
            const data = await Order.find({ user: req.user.id, status: "Confirmed" })
                .populate('user', 'name email')
                .populate('items.menuItem', 'name price')
                .populate('restaurant', 'name address')
                .sort({ orderDate: -1 });
            res.status(200).json({ msg: 'deleted successfully', data: data });
        }
    } catch (error) {
        next(error);
    }
});

//get all orders admin only
router.get('/all', adminAuth, async (req, res, next) => {
    const admin = await Admin.findById(req.admin.id);
    if (!admin) {
        throw new NotFoundError('No admin was found with the provided id')
    }
    try {
        const orders = await Order.find({})
            .sort({ orderDate: -1 })
            .populate('user', 'name email')
            .populate('items.menuItem', 'name price')
            .populate('restaurant', 'name address');
        if (orders) {
            res.status(200).json(orders)
        }
    } catch (error) {
        next(error)
    }
});


// @route  PUT api/order/:id/favorite
// @desc    Mark an order as favorite
// @access  Private
router.put('/:id/favorite', auth, async (req, res, next) => {
    try {
        const order = await Order.findById(req.params.id);

        if (!order || order.user.toString() !== req.user.id) {
            throw new NotFoundError('Order not found');
        }

        order.favorite = !order.favorite;
        await order.save();
        const orders = await Order.find({ user: req.user.id, status: "Confirmed" })
            .populate('user', 'name email')
            .populate('items.menuItem', 'name price')
            .populate('restaurant', 'name address')
            .sort({ orderDate: -1 });

        res.status(200).json(orders);
    } catch (err) {
        next(err);
    }
});


// @route   GET api/orders/favorites
// @desc    Get user's favorite orders
// @access  Private
router.get('/favorites', auth, async (req, res, next) => {
    try {
        const favoriteOrders = await Order.find({ user: req.user.id, favorite: true })
            .populate('items.menuItem')
            .sort({ orderDate: -1 });
        res.status(200).json(favoriteOrders);
    } catch (err) {
        next(err);
    }
});

//cart
router.get('/my-orders-cart', auth, async (req, res, next) => {
    const user = await User.findById(req.user.id);

    if (!user) {
        throw new NotFoundError('No user was found with the provided id.')
    }

    try {
        const orders = await Order.find({ user: req.user.id, status: "Pending" })
            .populate('user', 'name email')
            .populate('items.menuItem', 'name price')
            .populate('restaurant', 'name address')
            .sort({ orderDate: -1 });
        res.json(orders);
    } catch (err) {
        next(err);
    }
});

//delivered orders
router.get('/my-orders-delivered', auth, async (req, res, next) => {
    const user = await User.findById(req.user.id);

    if (!user) {
        throw new NotFoundError('No user was found with the provided id.')
    }

    try {
        const orders = await Order.find({ user: req.user.id, status: "Delivered" })
            .populate('user', 'name email')
            .populate('items.menuItem', 'name price')
            .populate('restaurant', 'name address')
            .sort({ orderDate: -1 });
        res.json(orders);
    } catch (err) {
        next(err);
    }
});


router.put('/delivered/:orderId', adminAuth, async (req, res, next) => {
    const {orderId} = req.params;

    const admin = await Admin.findById(req.admin.id);

    if(!admin){
        throw new NotFoundError('No user was found with the provided id');
    }

    try {
        const order = await Order.findOne({_id: orderId});
        if ((order.status !== 'Confirmed')){
            throw new BadrequestError('order must either be confirmed or prepared');
        }
        order.status = 'Delivered';
        await order.save();

        const setNotification = new Notification({
            user: order.user._id,
            message: `Your order #${order._id} has been delivered.`,
            type: 'order_delivered',
            orderId: order._id
        });

        await setNotification.save();

        const orders = await Order.find({})
            .populate('user', 'name email')
            .populate('items.menuItem', 'name price')
            .populate('restaurant', 'name address')
            .sort({ orderDate: -1 });

        res.status(200).json({msg:'delivery activated', data: orders});
    } catch (error) {
        next(error);
    }
});

//Confirm order

module.exports = router
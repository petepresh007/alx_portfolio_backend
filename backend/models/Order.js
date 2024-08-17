const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    items: [
        {
            menuItem: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Menu',
                required: true,
            },
            price: {
                type: Number,
                required: true,
            },
        },
    ],
    restaurant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Restaurant',
        required: true,
    },
    protein: Array,
    quantity: {
        type: Number,
        required: true,
        min: 1,
        default: 1
    },
    totalAmount: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        enum: ['Pending', 'Confirmed', 'Prepared', 'Delivered', 'Cancelled'],
        default: 'Pending',
    },
    orderDate: {
        type: Date,
        default: Date.now,
    },
    deliveryAddress: {
        type: String,
        required: true,
    },
    paymentMethod: {
        type: String,
        enum: ['Card', 'Cash', 'Online'],
        required: true,
    },
    paymentStatus: {
        type: String,
        enum: ['Pending', 'Paid'],
        default: 'Pending',
    },
    pack: {
        type: String,
        enum: ['Big Pack', 'Branded Pack'],
        default: 'Big Pack'
    },
    favorite: {
        type: Boolean,
        default: false,
    },
});


module.exports = mongoose.model('Order', OrderSchema);
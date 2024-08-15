const mongoose = require('mongoose');

const RestaurantSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    menu: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Menu'
    }]
});

module.exports = mongoose.model('Restaurant', RestaurantSchema);

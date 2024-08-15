const mongoose = require('mongoose');

const MenuSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Menu item name is required'],
        trim: true,
        unique: true,
    },
    description: {
        type: String,
        required: [true, 'Menu item description is required'],
    },
    price: {
        type: Number,
        required: [true, 'Menu item price is required'],
        min: [0, 'Price cannot be negative'],
    },
    category: {
        type: String,
        required: [true, 'Menu item category is required'],
    },
    availability: {
        type: Boolean,
        default: true,
    },
    file: {
        type: String,
        required: [true, 'Menu item image URL is required'],
    },
    protein: [
        {
            price: {
                type: Number
            },
            available: {
                type: [String]
            }
        }
    ],
    others: [String],
    restaurant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Restaurant',
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
});



module.exports = mongoose.model('Menu', MenuSchema);
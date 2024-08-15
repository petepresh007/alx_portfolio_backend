const express = require('express');
const router = express.Router();
const Restaurant = require('../models/Restaurant');
const { adminAuth } = require('../middleware/auth');
const { BadrequestError, NotFoundError, ConflictError } = require('../errors');
const Admin = require('../models/Admin');


// Add a new restaurant (Admin only)
router.post('/add', adminAuth, async (req, res, next) => {
    const { name, address, phone, email } = req.body;
    const admin = await Admin.findById(req.admin.id);
    if (!admin) {
        throw new NotFoundError('No admin was found with the supplied id');
    }

    try {
        if (!name || !address || !phone || !email) {
            throw new BadrequestError('To create a restaurant, all fields are needed')
        }
        const existingRestaurant = await Restaurant.findOne({ name });
        if (existingRestaurant) {
            throw new ConflictError('restaurant name already exists..');
        }
        const restaurant = new Restaurant({
            name,
            address,
            phone,
            email
        });
        await restaurant.save();
        res.status(201).json({ message: 'Restaurant added successfully', restaurant });
    } catch (error) {
        next(error);
    }
});

// Add a menu item to a restaurant (Admin only)
// router.post('/:restaurantId/menu/add', adminAuth, async (req, res, next) => {
//     const { name, description, price, image } = req.body;
//     const { restaurantId } = req.params;
//     try {
//         const menuItem = new MenuItem({ name, description, price, image, restaurant: restaurantId });
//         await menuItem.save();

//         const restaurant = await Restaurant.findById(restaurantId);
//         restaurant.menu.push(menuItem._id);
//         await restaurant.save();

//         res.status(201).json({ message: 'Menu item added successfully', menuItem });
//     } catch (error) {
//         next(error);
//     }
// });



// Get all restaurants
router.get('/', async (req, res, next) => {
    try {
        const restaurants = await Restaurant.find().populate('menu');
        res.status(200).json(restaurants);
    } catch (error) {
        next(error);
    }
});


// Get a specific restaurant by ID
router.get('/:id', async (req, res, next) => {
    try {
        const restaurant = await Restaurant.findById(req.params.id).populate('menu');
        if (!restaurant) {
            return res.status(404).json({ message: 'Restaurant not found' });
        }
        res.status(200).json(restaurant);
    } catch (error) {
        next(error);
    }
});


// Update a restaurant's details (Admin only)
router.put('/:id', adminAuth, async (req, res, next) => {
    const { name, address, phone, email } = req.body;
    const admin = await Admin.findById(req.admin.id);

    if (!admin) {
        throw new BadrequestError('No admin was found with the provided id')
    }

    try {
        if (!name && !address && !phone && !email) {
            throw new BadrequestError('enter at least a field to update');
        }
        const ourRestaurant = await Restaurant.findById(req.params.id);

        const restaurant = await Restaurant.findByIdAndUpdate(req.params.id, {
            name: name ? name : ourRestaurant.name,
            address: address ? address : ourRestaurant.address,
            phone: phone ? phone : ourRestaurant.phone,
            email: email ? email : ourRestaurant.email
        },
            { new: true }
        );

        if (!restaurant) {
            return res.status(404).json({ message: 'Restaurant not found' });
        }
        res.status(200).json({ message: 'Restaurant updated successfully', restaurant });
    } catch (error) {
        next(error);
    }
});

// Delete a restaurant (Admin only)
router.delete('/:id', adminAuth, async (req, res, next) => {
    try {
        const restaurant = await Restaurant.findByIdAndDelete(req.params.id);
        if (!restaurant) {
            return res.status(404).json({ message: 'Restaurant not found' });
        }
        res.status(200).json({ message: 'Restaurant deleted successfully' });
    } catch (error) {
        next(error);
    }
});

module.exports = router;
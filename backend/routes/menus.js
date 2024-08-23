const Admin = require('../models/Admin');
const Menu = require('../models/Menu');
const { adminAuth } = require('../middleware/auth');
const { BadrequestError, NotFoundError, ConflictError } = require('../errors');
const express = require("express")
const router = express.Router();
const { upload } = require('../multer');
const fs = require('fs');
const { deleteFile } = require("../middleware/deletefile");
const path = require("path");
const Restaurant = require("../models/Restaurant");


//create menu
router.post('/create-menu/:restaurantId', adminAuth, upload.single('file'), async (req, res, next) => {
    const { name, description, price, category, availability, protein, others } = req.body;
    const admin = await Admin.findById(req.admin.id)
    const { restaurantId } = req.params

    if (!admin) {
        throw new NotFoundError('no admin was found with the provided id')
    }

    try {
        //s3
        //const imageUrl = req.file.location;
        if (!name || !description || !price || !category || !req.file) {
            throw new BadrequestError('all fields are needed')
        }

        const existingItem = await Menu.findOne({ description });

        if (existingItem) {
            throw new ConflictError(`a menu already exists with the provided description`)
        }

        const createdMenu = new Menu({
            name,
            description,
            price,
            category,
            availability,
            file: req.file.filename,
            restaurant: restaurantId,
            protein: protein ? protein : [],
            others: others ? others : []
        })
        if (createdMenu) {
            await createdMenu.save();
            const restaurant = await Restaurant.findById(restaurantId)
            restaurant.menu.push(createdMenu._id);
            await restaurant.save();
            res.status(201).json({ msg: `Menu created successfully...` })
        }

    } catch (error) {
        if (req.file) {
            fs.unlinkSync(req.file.path)
        }
        next(error)
    }
});


//edit Menu
router.put('/update/:menuID', adminAuth, upload.single('file'), async (req, res, next) => {
    const { menuID } = req.params;
    const { name, description, price, category, availability, protein, others } = req.body;

    try {
        const menu = await Menu.findById(menuID);
        if(!menu){
            throw new NotFoundError('No menu was found');
        }
        const updateMenu = await Menu.findOneAndUpdate({_id : menuID}, {
            name: name ? name : menu.name,
            description: description ? description : menu.description,
            price: price ? price : menu.price,
            category: category ? category : menu.category,
            availability: availability ? availability : menu.availability,
            file: req.file ? req.file.filename : menu.file,
            restaurant: menu.restaurant,
            protein: protein ? protein : menu.protein,
            others: others ? others : menu.others
        })

        res.status(200).json({msg: 'updated successfully', updateMenu})
    } catch (error) {
        if (req.file) {
            fs.unlinkSync(req.file.path)
        }
        next(error)
    }
})


//delete menu
router.delete('/del/:menuID', adminAuth, async (req, res, next) => {
    const admin = await Admin.findById(req.admin.id);
    const { menuID } = req.params

    if (!admin) {
        throw new NotFoundError('no admin was found with the provided id')
    }

    try {
        const menu = await Menu.findById(menuID);
        if (!menu) {
            throw new NotFoundError(`No menu was found with the provided id`)
        }
        const delMenu = await Menu.findByIdAndDelete(menuID);
        if (delMenu) {
            deleteFile(path.join(__dirname, "..", "upload", menu.file))
            const data = await Menu.find({})
                .sort({ createdAt: -1 });
            res.status(200).json({ msg: 'file deleted successfully', data: data })
        }
    } catch (error) {
        next(error);
    }
})

router.put('/add-protein/:id', adminAuth, async (req, res, next) => {
    const {protein} = req.body;
    try {
        const menu = await Menu.findById(req.params.id);
        if(!menu){
            throw new NotFoundError('No menu was found with the provided id');
        }
        menu.protein = protein;
        await menu.save();
        res.status(200).json({msg:'updated protein'});
    } catch (error) {
        next(error);
    }
})

router.get('/all', async(req, res, next) => {
    try {
        const all = await Menu.find({})
            .populate('restaurant')
            .sort({createdAt: -1});
        res.status(200).json(all)
    } catch (error) {
        next(error)
    }
})

router.get('/alladmin', adminAuth, async (req, res, next) => {
    try {
        const all = await Menu.find({})
            .populate('restaurant')
            .sort({ createdAt: -1 });
        res.status(200).json(all)
    } catch (error) {
        next(error)
    }
})


module.exports = router
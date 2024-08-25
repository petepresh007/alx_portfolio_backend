// routes/auth.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const { BadrequestError, ConflictError, NotAuthorizedError } = require("../errors");


dotenv.config();

const User = require('../models/Admin');
const {adminAuth} = require('../middleware/auth');

// @route   POST api/auth/register
// @desc    Register user
// @access  Public

router.post('/register', async (req, res, next) => {
    const { name, email, password } = req.body;
    try {
        if (!name || !email || !password) {
            throw new BadrequestError('all fields are required...')
        }
        let user = await User.findOne({ email });
        if (user) {
            throw new ConflictError('email already exists. enter another email')
            //return res.status(400).json({ msg: 'User already exists' });
        }
        user = new User({
            name,
            email,
            password,
        });
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
        await user.save();

        const payload = {
            user: {
                id: user.id,
                username: user.name
            },
        };
        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: 360000 },
            (err, token) => {
                if (err) throw err;
                //res.json({ token, user: user.name });
                res.cookie('admintoken', token, {
                    httpOnly: true,
                    secure: true,//process.env.NODE_ENV === 'production', // Use secure cookies in production
                    maxAge: 360000 * 1000, // Cookie expiration time in milliseconds
                    sameSite: 'none'
                })
                res.status(201).json({ user: user.name });
            }
        );
    } catch (err) {
        //console.error(err.message);
        next(err)
        //res.status(500).send('Server error');
    }
});


// @route   POST api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post('/login', async (req, res, next) => {
    const { email, password } = req.body;
    try {
        if (!email || !password) {
            throw new BadrequestError('All fields are required...')
        }

        let user = await User.findOne({ email });
        if (!user) {
            // return res.status(400).json({ msg: 'Invalid Credentials' });
            throw new BadrequestError("Invalid Credentials")
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            //return res.status(400).json({ msg: 'Invalid Credentials' });
            throw new BadrequestError("Invalid Credentials");
        }

        const payload = {
            user: {
                id: user.id,
                username: user.name
            },
        };
        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: 360000 },
            (err, token) => {

                if (err) throw err;
                res.cookie('admintoken', token, {
                    httpOnly: true,
                    secure: true,//process.env.NODE_ENV === 'production', // Use secure cookies in production
                    maxAge: 360000 * 1000, // Cookie expiration time in milliseconds
                    sameSite: 'none'
                })
                res.status(200).json({ user: user.name });
            }
        );
    } catch (err) {
        //console.error(err.message);
        //res.status(500).send('Server error');
        next(err)
    }
});


//@route   POST api/auth/stay-loggedin
// @desc    Authenticate user & get token
// @access  Public
router.get('/stay-loggedin', async function (req, res) {
    const { admintoken } = req.cookies
    if (!admintoken) {
        throw new NotAuthorizedError('you token is not valid')
    }

    try {
        const decode = jwt.verify(admintoken, process.env.JWT_SECRET);
        res.status(200).json(decode)
    } catch (error) {
        throw new NotAuthorizedError('you are not authorized to access this route')
    }
})

//@route   POST api/auth/logout
// @desc    logout a user
// @access  Public
// router.post('/logout', (req, res) => {
//     res.cookie('admintoken', '', {
//         httpOnly: true,
//         secure: true,//process.env.NODE_ENV === 'production',
//         expires: new Date(0),
//         sameSite:'none'
//     })
//     res.send(true)
// })

router.post('/logout', (req, res) => {
    res.clearCookie('admintoken', { httpOnly: true, sameSite: 'none', secure: true })
        .json(true);
})

module.exports = router;
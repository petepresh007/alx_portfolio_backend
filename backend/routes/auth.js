const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const { BadrequestError, ConflictError, NotAuthorizedError, NotFoundError } = require("../errors");
const crypto = require('crypto');
const { fronturl } = require('../fronturl');
const { sendMail } = require('../middleware/sendEmail');
const Order = require('../models/Order');


dotenv.config();

const User = require('../models/User');
const { auth, adminAuth } = require('../middleware/auth');
const Admin = require('../models/Admin');
const order = require('../models/Order');

// @route   POST api/auth/register
// @desc    Register user
// @access  Public

router.post('/register', async (req, res, next) => {
    const { name, email, password, phoneNumber } = req.body;
    try {
        if (!name || !email || !password || !phoneNumber) {
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
            phoneNumber,
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
                res.cookie('token', token, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
                    maxAge: 360000 * 1000 // Cookie expiration time in milliseconds
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
                res.cookie('token', token, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
                    maxAge: 360000 * 1000, // Cookie expiration time in milliseconds
                })
                
                res.status(200).json({ user: user.name, id: user._id, phone: user.phoneNumber });
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
    const { token } = req.cookies
    if (!token) {
        throw new NotAuthorizedError('you token is not valid')
    }

    try {
        const decode = jwt.verify(token, process.env.JWT_SECRET);
        res.status(200).json(decode)
    } catch (error) {
        throw new NotAuthorizedError('you are not authorized to access this route')
    }
})

//@route   POST api/auth/logout
// @desc    logout a user
// @access  Public
router.post('/logout', (req, res) => {
    res.cookie('token', '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        expires: new Date(0)
    })
    res.send(true)
})

/**TO BE TESTED */

//admin get users
router.get('/admin-get-user', adminAuth, async (req, res, next) => {

    try {
        const user = await User.find({})
            .sort({ date: -1 })
        if (user) {
            res.status(200).json(user);
        }
    } catch (error) {
        next(error);
    }
});

//admin delete user
router.delete('/del-user-admin/:id', adminAuth, async (req, res, next) => {
    const admin = await Admin.findById(req.admin.id);
    if (!admin) {
        throw new NotFoundError('No admin was found with the provided id');
    }
    try {
        const delUser = await User.findByIdAndDelete(req.params.id);
        if (delUser) {
            const data = await User.find({})
                .sort({ date: -1 })
            res.status(200).json({ msg: `user deleted successfully...`, data: data });
        }
    } catch (error) {
        next(error)
    }
})

//user get user
router.get('/user', auth, async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);
        if (user) {
            res.status(200).json(user);
        }
    } catch (error) {
        next(error);
    }
});


//user change password
router.put('/change-passord', auth, async (req, res, next) => {
    const { password, newpassword, confirmpassword } = req.body;
    try {
        if (!password || !newpassword || !confirmpassword) {
            throw new BadrequestError('enter all fields to change your password')
        }
        const user = await User.findById(req.user.id);
        if (!user) {
            throw new NotFoundError('No user was found with the provided id..')
        }
        const checkPassword = await bcrypt.compare(password, user.password);
        if (!checkPassword) {
            throw new BadrequestError('enter a valid password');
        }

        if (newpassword !== confirmpassword) {
            throw new BadrequestError('enter the same value for both password fileds..');
        }
        const salt = await bcrypt.genSalt(10) //10 salt rounds
        const changedPassword = await bcrypt.hash(newpassword, salt);

        user.password = changedPassword;
        await user.save();
        res.status(200).json({ msg: 'password changed successfully...' });
    } catch (error) {
        next(error);
    }
});

//user change username
router.put('/change-username', auth, async (req, res, next) => {
    const { name } = req.body;
    try {
        if (!name) {
            throw new BadrequestError('please enter a username');
        }
        const user = await User.findById(req.user.id);
        if (!user) {
            throw new BadrequestError('No user was found with the provide id..');
        }
        user.name = name;
        await user.save();
        res.status(200).json({ msg: `you changed your username to "${user.name}"` })
    } catch (error) {
        next(error);
    }
})


//forget password
router.post('/forgetpassword', async (req, res) => {
    const { email } = req.body;
    const userData = await User.findOne({ email });

    if (!userData) {
        throw new BadrequestError("Please provide a vaid email address");
    }
    const token = crypto.randomBytes(20).toString("hex");
    userData.resetPasswordToken = token;
    userData.resetPasswordExpires = Date.now() + 3600000;
    await userData.save();


    const sent_from = process.env.SMTP_MAIL
    const send_to = email;
    const subject = "reset password";
    const message = `
        You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n
           Please click on the following link, or paste this into your browser to complete the process within one hour of receiving it:\n\n
           ${fronturl}/reset-password-user/${token}\n\n
           If you did not request this, please ignore this email and your password will remain unchanged.\n
        `
    await sendMail(sent_from, send_to, subject, message);
    res.status(200).json({ msg: `check the email: ${email} to reset your password` });
})

router.post('/reset-password/:token', async (req, res) => {
    const { token } = req.params;
    const { password, confirmpassword } = req.body;

    if (!password || !confirmpassword) {
        throw new BadrequestError("please complete the available fields to update your password")
    }

    const userData = await User.findOne({
        resetPasswordToken: token,
        resetPasswordExpires: { $gt: Date.now() }
    })

    if (!userData) {
        throw new BadrequestError("Your token has expired")
    }

    if (password !== confirmpassword) {
        throw new BadrequestError("make sure the passwords are the same.")
    }

    userData.password = await bcrypt.hash(password, 10) //ten salt round
    userData.resetPasswordToken = '';
    userData.resetPasswordExpires = '';
    await userData.save();

    res.status(200).json({ msg: `password changed successfully...` })
})


module.exports = router;
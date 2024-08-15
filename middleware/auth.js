// middleware/auth.js
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const { NotAuthorizedError } = require("../errors");

dotenv.config();

function auth(req, res, next){
    const { token } = req.cookies
    
    if (!token) {
        throw new NotAuthorizedError('you token is not valid')
    }

    try {
        const decode = jwt.verify(token, process.env.JWT_SECRET);
        req.user = { id : decode.user.id, username: decode.user.username }
        next();
    } catch (error) {
        throw new NotAuthorizedError("please, enter a valid token")
    }
};


function adminAuth(req, res, next) {
    const { admintoken } = req.cookies
    if (!admintoken) {
        throw new NotAuthorizedError('you token is not valid')
    }

    try {
        const decode = jwt.verify(admintoken, process.env.JWT_SECRET);
        req.admin = { id: decode.user.id, username: decode.user.username }
        next();
    } catch (error) {
        throw new NotAuthorizedError("please, enter a valid token")
    }
};

module.exports = {
    auth,
    adminAuth
}
const { StatusCodes } = require('http-status-codes');
const wrapper = require('express-async-handler');
const jwt = require('jsonwebtoken');
const client = require('../service/redis');
const { UnauthorizedError, BadRequestError } = require('../errors');



const adminMiddleware = wrapper(async (req, res, next) => {
    const { authorization } = req.headers;
    if (!authorization || !authorization.startsWith('Bearer')) {
        throw new BadRequestError('Invalid or No token provided'); 
    }
    const token = authorization.split(' ')[1];

    if (token) {
        try {
            const blacklisted = await client.get(`blacklisted:${token}`);
            if (blacklisted) {
                throw new UnauthorizedError('Token is invalidated , please login in again'); 
            }
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const { role, userId } = decoded;
            req.user = userId;
            if (role === 'admin' || role === 'superAdmin') {
                next();
            } else {
                throw new UnauthorizedError('Unauthorized , access denied'); 
            }
        } catch (error) {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: "expired or invalid token , login again ! " });
        }
    }
});


module.exports = adminMiddleware; 
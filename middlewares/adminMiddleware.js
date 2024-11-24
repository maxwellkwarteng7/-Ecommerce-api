const { StatusCodes } = require('http-status-codes');
const wrapper = require('express-async-handler');
const jwt = require('jsonwebtoken');
const client = require('../service/redis'); 



const adminMiddleware = wrapper(async (req, res, next) => {
    const { authorization } = req.headers;  
    if (!authorization || !authorization.startsWith('Bearer')) {
        return res.status(StatusCodes.UNAUTHORIZED).json({ msg: 'Invalid or no token provided' }); 
    }
    const token = authorization.split(' ')[1]; 
    
    if (token) {
        try {
            const blacklisted = await client.get(`blacklisted:${token}`);
            if (blacklisted) {
                return res.status(StatusCodes.UNAUTHORIZED).json({ error: 'Token is invalidated , please login in again' }); 
            }
            const decoded = jwt.verify(token, process.env.JWT_SECRET); 
            const { role, userId } = decoded; 
            req.user = userId; 
            console.log(role);  
            if (role !== 'admin' || role !== 'superAdmin') {
                return res.status(StatusCodes.UNAUTHORIZED).json({ error: "Access denied "}); 
            }
            // find the user 
            next(); 
        } catch (error) {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: "sorry something went wrong ! " }); 
        } 
    }
});


module.exports = adminMiddleware; 
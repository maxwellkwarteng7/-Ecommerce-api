const { StatusCodes } = require('http-status-codes');
const wrapper = require('express-async-handler');
const jwt = require('jsonwebtoken');
const client = require('../service/redis'); 


const validateToken = wrapper(async (req, res, next) => {
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
            const { userId } = decoded; 
            req.userId = userId;  
            next(); 
        } catch (error) {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: "Invalid or expired token , login again please ! " }); 
        } 
    }
});


module.exports = validateToken; 
const { StatusCodes } = require('http-status-codes'); 
const wrapper = require('express-async-handler'); 
const jwt = require('jsonwebtoken'); 


const validateToken = wrapper(async (req, res, next) => {
    const { token } = req.body;
    if (!token || !token.startsWith('Bearer')) {
        res.status(StatusCodes.UNAUTHORIZED).json({ error: 'Access Denied , no token provided' }); 
    }

    try {
        const verifiedToken = await jwt.verify(token, process.env.JWT_SECRET);
        if (!verifiedToken) {
            return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Invalid or expired Token' }); 
        }
        const { userId } = verifiedToken; 
        req.user = userId; 
        next(); 
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "something went wrong ! , please try again later" }); 
    } 
}); 


module.exports = validateToken; 
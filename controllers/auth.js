const { StatusCodes } = require('http-status-codes'); 
const wrapper = require('express-async-handler'); 
const { User, Sequelize } = require('../models'); 
const jwt = require('jsonwebtoken'); 
const { ValidationError } = require('sequelize');

const register = wrapper(async (req , res ) => {
    const { username, email, password } = req.body; 
    if (!username || !email || !password) {
        res.status(StatusCodes.BAD_REQUEST).json({ error: "all fields are required" }); 
    }
    try {
        await User.create({ username, email, password }); 
        res.status(StatusCodes.CREATED).json({ message: "registration Successful" });
    } catch (error) {
        if (error instanceof ValidationError) {
            return res.status(StatusCodes.BAD_REQUEST).json({ error: error.errors[0].message }); 
        }
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'sorry something went wrong , try again later/!' }); 
    }
         
    }
);


const login = wrapper(async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(StatusCodes.BAD_REQUEST).json({ error: "Both email and password fields are required" }); 
    }
 
        const user = await User.findOne({ where: { email } }); 
        if (!user) {
           return  res.status(StatusCodes.UNAUTHORIZED).json({ error: "No user with this email found" }); 
        }
        const isMatch = user && (await user.validatePassword(password, user.password));
        if (!isMatch) {
           return  res.status(StatusCodes.UNAUTHORIZED).json({ error: "Wrong or Invalid password , try again" }); 
        }
        const token =  jwt.sign({ userId: user.id }, process.env.JWT_SECRET); 
        res.status(StatusCodes.OK).json({
            message: {
                username: user.username,
                userRole: user.role,
                userEmail: user.email,
                token
            }
        });  
}); 


module.exports = {
    register, 
    login
}
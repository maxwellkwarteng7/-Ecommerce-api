const { StatusCodes } = require('http-status-codes');
const wrapper = require('express-async-handler');
const { User, oneTimePin ,  Sequelize } = require('../models');
const jwt = require('jsonwebtoken');
const { ValidationError, Model } = require('sequelize');
const client = require('../service/redis');
const { restart } = require('nodemon');
const send6digitCode = require('../utils/mailSender');
const emailService = require('../service/emailService');
 

const register = wrapper(async (req, res) => {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
       return res.status(StatusCodes.BAD_REQUEST).json({ error: "all fields are required" });
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
        return res.status(StatusCodes.UNAUTHORIZED).json({ error: "No user with this email found" });
    }
    const isMatch = user && (await user.validatePassword(password, user.password));
    if (!isMatch) {
        return res.status(StatusCodes.UNAUTHORIZED).json({ error: "Wrong or Invalid password , try again" });
    }
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(StatusCodes.OK).json({
        message: {
            username: user.username,
            userRole: user.role,
            userEmail: user.email,
            token
        }
    });
});


const logout = wrapper(async (req, res) => {
    const { authorization } = req.headers;
    if (!authorization || !authorization.startsWith('Bearer')) {
        return res.status(StatusCodes.UNAUTHORIZED).json({ msg: 'Invalid or no token provided' });
    }
    const token = authorization.split(' ')[1];

    try {
        const verifiedToken = jwt.verify(token, process.env.JWT_SECRET);
        if (!verifiedToken || !verifiedToken.exp) {
            return res.status(StatusCodes.UNAUTHORIZED).json({ error: "Invalid Token" });
        }

        // creating an expiration time 
        const expiration = verifiedToken.exp - Math.floor(Date.now() / 1000);
      
        // blacklisting the token in the redis 

        await client.set(`blacklisted:${token}`, 'blacklisted', { EX: expiration });
        res.status(StatusCodes.OK).json({ message: "Logout Successful" });
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Error logging out " });
    }
});

// send 6 digit code 
const initiateResetPassword = wrapper(async (req , res ) => {
    const { email } = req.body; 
    if (!email) {
        return res.status(StatusCodes.BAD_REQUEST).json({ error: "email field cannot be empty" }); 
    }
    const user = await User.findOne({ where: { email } }); 
    if (!user) {
        return res.status(StatusCodes.NOT_FOUND).json({ error: 'No user with this email found' }); 
    }
    emailService(user, "Reset Password Pin"); 
    res.status(StatusCodes.OK).json({ message: 'Email has been sent' }); 
}); 

//change or reset password 
const resetPassword = wrapper(async (req, res) => {
    const { pin , email , password} = req.body;
    if (!pin || !email || !password) {
       return  res.status(StatusCodes.BAD_REQUEST).json({ error: "pin ,  password and email fields are required" }); 
    }
    // fetch the usr 
    const user = await User.findOne({
        where: { email }, include: [
            {
                model: oneTimePin, 
                as : 'forgotPasswordPin'
        }
    ] }); 
    if (!user) {
       return  res.status(StatusCodes.NOT_FOUND).json({ error: "No user with this email found" }); 
    }
    const currentTime = new Date(); 

    if (!user.forgotPasswordPin.pin === pin || user.forgotPasswordPin.expiresIn < currentTime) {
        return res.status(StatusCodes.UNAUTHORIZED).json({ error: 'invalid or expired pin ' }); 
    }

    user.password = password; 
    user.save(); 
    res.status(StatusCodes.OK).json({ message: "password changed successful" }); 
    // checking if the pin entered is equal to the onetimepin 
   

  
}); 

module.exports = {
    register,
    login,
    logout, 
    initiateResetPassword, 
    resetPassword
}
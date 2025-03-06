const wrapper = require('express-async-handler'); 
const { StatusCodes } = require('http-status-codes'); 
const { User , Cart } = require('../models'); 
const { NotFoundError, BadRequestError } = require('../errors');
const axios = require('axios');
require('dotenv').config(); 

const initializePayment = wrapper(async (req, res) => {
    const { userId } = req; 
    // find the email of the user and fetch the cart of the user
    const user = await User.findOne({
        where: { id :  userId }, include: [
            {
                model: Cart, 
                as : 'cart'
        }
        ]
    }); 

    if (!user) {
        throw new NotFoundError("User not found"); 
    }
    //define necessary variables 
    const totalPrice = user.cart.totalPrice; 
    const email = user.email; 
    const paystackURL = "https://api.paystack.co/transaction/initialize";
    
    // initialize payment to paystack 
    const response = await axios.post(paystackURL, {
        email,
        amount: totalPrice * 100, 
        currency: 'GHS', 
    },
        {
            headers: {
                Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
                "Content-Type": 'application/json',
            },
        }
    ); 
    console.log(response); 
    res.status(StatusCodes.OK).json({ message: 'Payment initiated' , link : response.data.data.authorization_url }); 
}); 


// verify the payment 
const verifyPayment = wrapper(async (req, res) => {
    const { reference } = req.params; 
    if (!reference) {
        throw new BadRequestError("No payment 'reference' provided"); 
    }
    // we make a post request to paystack to verify the status of the payment with this 'reference'
    const url = `https://api.paystack.co/transaction/verify/${reference}`;  

    const response = await axios.get(url, {
        headers: {
            Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
            "Content-Type": "application/json"
        }
    }); 

    if (response.data.status === 'success') {
        // turn cart into orders here
        
        // do what you gotta do here 
        res.status(StatusCodes.OK).json({ message: "Payment Successful" }); 
    } else {
        res.status(StatusCodes.BAD_REQUEST).json({ error: "Payment verification failed" }); 
    }
}); 







module.exports = {
    initializePayment, 
    verifyPayment
}; 
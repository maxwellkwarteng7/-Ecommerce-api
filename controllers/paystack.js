const wrapper = require('express-async-handler'); 
const { StatusCodes } = require('http-status-codes'); 
const { User , Cart } = require('../models'); 
const { NotFoundError } = require('../errors');
const axios = require('axios');
require('dotenv').config(); 

const pay = wrapper(async (req, res) => {
    const { userId } = req; 
    // find the email of the user and fetch the cart of the user
    const user = await User.findOne({
        where: { userId }, include: [
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
        currency: 'Ghs'
    },
        {
            headers: {
                Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
                "Content-Type": 'application/json',
            },
        }
    ); 

    

    res.status(StatusCodes).json({ message: 'Payment initiated' , data : response.data }); 

}); 



module.exports = {
    pay
}; 
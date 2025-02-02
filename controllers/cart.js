const { StatusCodes } = require("http-status-codes");
const wrapper = require("express-async-handler");
const { Cart, CartItems } = require("../models");
const { BadRequestError } = require("../errors");

const addToCart = wrapper(async (req, res) => {
    const { productId } = req.body;
    if (!productId) {
        throw new BadRequestError('Product Id required'); 
    }
    const { userId } = req;

    // check if this user has a cart 

   
    // check if user has a cart if not create one for user 
    const userCart = await Cart.findOne({ where: { userId } });
}); 






module.exports = {
    
}





const { StatusCodes } = require("http-status-codes");
const wrapper = require("express-async-handler");
const { Cart, CartItems } = require("../models");

const addToCart = wrapper(async (req, res) => {
    const { productId } = req.body;
    const { userId } = req.userId;
    console.log(req.userId, userId);
    return;
    // check if user has a cart if not create one for user 
    const userCart = await Cart.findOne({ where: { userId } });
}); 






module.exports = {
    addToCart
}





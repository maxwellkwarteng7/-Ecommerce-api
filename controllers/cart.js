const { StatusCodes } = require("http-status-codes");
const wrapper = require("express-async-handler");
const { Cart, CartItems } = require("../models");
const { BadRequestError } = require("../errors");



async function AddProductToCart (cartItems , userId) {
    //check if the user has a cart 
    const hasCart = await Cart.findOne({ where: { userId } }); 
    if (hasCart) {
        for (let item of cartItems) {
            const cartId = hasCart.id; 
            const { productId, quantity } = item; 
            
            // check if the product already exist in the cartItem
            const productExist = await CartItems.findOne({ where: { cartId, productId } }); 

            if (productExist) {
                productExist.quantity += quantity; 
                
            }
        }
    } else {
        
    }
}

const addToCart = wrapper(async (req, res) => {
    const { cartItemsArray } = req.body;
    if (!cartItemsArray || !Array.isArray(cartItemsArray)) {
        throw new BadRequestError('cart Items are required or must be an array'); 
    }
    const { userId } = req;
    const cart = await AddProductToCart(cartItemsArray, userId);

   
    // check if user has a cart if not create one for user 
    const userCart = await Cart.findOne({ where: { userId } });
}); 






module.exports = {
    addToCart
}





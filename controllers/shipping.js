const { StatusCodes } = require("http-status-codes");
const wrapper = require("express-async-handler");
const { Cart, Address } = require("../models");
const { BadRequestError, NotFoundError } = require("../errors");

const postAddress = wrapper(async (req, res) => {
    const { fullName, phone, address1, address2, country, city, state } = req.body; 
    const { userId } = req; 
    if (!fullName || !phone || !address1 || !country || !city || !state) throw new BadRequestError('All fields are required except address1'); 

    // find the cart 
    const cart = await Cart.findOne({ where: userId }); 
    // create a shipping / billing address 
    const shippingAddress = await Address.create({ fullName, phone, address1, address2, country, city, state, cartId: cart.id, userId }); 
    res.status(StatusCodes.CREATED).json('Address created');
}); 
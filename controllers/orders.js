const wrapper = require('express-async-handler'); 
const { StatusCodes } = require('http-status-codes'); 
const { BadRequestError, NotFoundError } = require('../errors/index'); 
const { Orders , User } = require('../models'); 


const userOrders = wrapper(async (req, res) => {
    const { userId } = req; 
    // find the user and fetch the orders 
    
}); 




module.exports = {
    userOrders
}


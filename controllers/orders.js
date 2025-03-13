const wrapper = require('express-async-handler'); 
const { StatusCodes } = require('http-status-codes'); 
const { BadRequestError, NotFoundError } = require('../errors/index'); 
const { Orders , User , OrderItems , Address } = require('../models'); 


const userOrders = wrapper(async (req, res) => {
    const { userId } = req; 
    // find the user and fetch the orders 
    const orders = await User.findOne({
        where: { id: userId }, include: [
            {
                model: Orders,
                as: 'user_orders',
                include: [
                    {
                        model: Address,
                        as: 'order_shipping_address'
                    }
                ]
            }
        ],
        order: [[{ model: Orders, as: 'user_orders' }, 'createdAt', 'DESC']]
    }); 
    if (!orders) throw new NotFoundError('User has no orders'); 

    res.status(StatusCodes.OK).json(orders.user_orders); 
}); 


// get the order Items 
const getUserOrderItems = wrapper(async (req, res) => {
    const { orderId } = req.params; 
    if (!orderId) throw new BadRequestError('No order Id provided'); 
    
}); 






module.exports = {
    userOrders
}


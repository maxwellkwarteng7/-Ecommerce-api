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
    const page = req.params.page | 1;
    const limit = req.params.limit | 5; 
    const offset = (page - 1) * limit; 

    if (!orderId) throw new BadRequestError('No order Id provided'); 
    // find the order and fetch it's related items 
    const userOrderItems = await Orders.findOne({
        where: { id: orderId }, include: [
            {
                model: OrderItems,
                as: 'orderItems',
                limit,
                offset
            }
        ]
    }); 
    if (!userOrderItems) throw new NotFoundError('No order items found'); 
    res.status(StatusCodes.OK).json(userOrderItems.orderItems)

}); 






module.exports = {
    userOrders, 
    getUserOrderItems
}


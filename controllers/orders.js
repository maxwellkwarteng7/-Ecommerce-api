const wrapper = require('express-async-handler');
const { StatusCodes } = require('http-status-codes');
const { BadRequestError, NotFoundError } = require('../errors/index');
const { Orders, User, OrderItems, Address, Product } = require('../models');
const { Sequelize } = require('sequelize');



const userOrders = wrapper(async (req, res) => {
    const { userId } = req;
    // find the user and fetch the orders 
    const orders = await User.findOne({
        where: { id: userId }, include: [
            {
                model: Orders,
                as: 'user_orders',
                attributes: ['id', 'totalPrice', 'paymentDate', 'transactionRef', 'paymentMethod'],
                include: [
                    {
                        model: Address,
                        as: 'order_shipping_address',
                        attributes: ['fullName', 'phone', 'address1', 'address2', 'country', 'state', 'city']
                    },
                ]
            }
        ],
        order: [[{ model: Orders, as: 'user_orders' }, 'createdAt', 'DESC']]
    });

    if (!orders) throw new NotFoundError('User has no orders');

    for (const order of orders.user_orders) {
        order.dataValues.orderItemCount = await OrderItems.count({ where: { orderId: order.id } });
    }

    res.status(StatusCodes.OK).json({ userOrders: orders.user_orders });
});


// get the order Items 
const getUserOrderItems = wrapper(async (req, res) => {

    const { orderId } = req.params;
    let page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 2;
    let offset = (page - 1) * limit;

    if (!orderId) throw new BadRequestError('No order Id provided');
    // find the order and fetch it's related items 
    const userOrderItems = await Orders.findOne({
        where: { id: orderId }, include: [
            {
                model: OrderItems,
                as: 'orderItems',
                attributes: ['quantity', 'orderStatus'],
                include: [
                    {
                        model: Product,
                        as: 'product',
                        attributes: [
                            "image",
                            "price",
                            "discountPrice",
                            "name",
                        ]
                    }
                ],
                limit,
                offset
            }
        ],

    });

    const orderCount = await OrderItems.count({ where: { orderId } });

    res.status(StatusCodes.OK).json({
        currentPage: page,
        totalPages: Math.ceil(orderCount / limit),
        orderItems: userOrderItems.orderItems
    });

});






module.exports = {
    userOrders,
    getUserOrderItems
}


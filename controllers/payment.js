const wrapper = require('express-async-handler');
const { StatusCodes } = require('http-status-codes');
const { User, Cart, CartItems, Orders, OrderItems, Address, sequelize } = require('../models');
const { NotFoundError, BadRequestError } = require('../errors');
const axios = require('axios');
const { where } = require('sequelize');
require('dotenv').config();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const initializePayment = wrapper(async (req, res) => {
    const { userId } = req;
    // find the email of the user and fetch the cart of the user
    const user = await User.findOne({
        where: { id: userId }, include: [
            {
                model: Cart,
                as: 'cart'
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
    res.status(StatusCodes.OK).json({ message: 'Payment initiated', link: response.data.data.authorization_url });
});


// verify the payment 
const verifyPayment = wrapper(async (req, res) => {
    const { reference } = req.params;
    const { addressId } = req.body;
    const { userId } = req;
    console.log(userId); 
    if (!addressId) throw new BadRequestError('user address id is needed to create order');

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
    if (response.data.data.status === 'success') {
        const reference = response.data.data.reference;
        const createOrder = await makeCartOrders(userId, 'paystack', reference , addressId);
        res.status(StatusCodes.OK).json('payment Successful');
    } else {
        res.status(StatusCodes.BAD_REQUEST).json({ error: "Payment verification failed" });
    }
});


// paystac webhook 
const paystackwebhook = wrapper(async (req, res) => {
    const event = req.body;
    console.log("paystack webhook received ", event);

    if (event.event === 'change.success' && event.data.status === "success") {
        const reference = event.data.reference;


    }
    res.status(StatusCodes.OK).json('webhook received');
});


async function makeCartOrders(userId, paymentMethod, reference, addressId) {
    return sequelize.transaction(async (transaction) => {
        const userCart = await Cart.findOne({
            where: { userId }, include: [
                {
                    model: CartItems,
                    as: 'cartItems'
                }
            ],
            order: [[{ model: CartItems, as: 'cartItems' }, "createdAt", "DESC"]]
        });
        // find the user order or create one for the user 
        const paymentDate = Date.now(); 
        // take the cartitems 
        const totalPrice = userCart.totalPrice;
        // create an order for the user
    
        const userOder = await Orders.create({ userId, totalPrice, paymentMethod, transactionRef: reference, addressId, paymentDate });
    
        // create the order  from the cart table 
        for (let item of userCart.cartItems) {
            const { quantity, productId } = item;
            const orderId = userOder.id;
            await OrderItems.create({
                quantity,
                productId,
                orderId
            }, {
                transaction
            });
        }
        await CartItems.destroy({ where: { cartId : userCart.id } } , {transaction}); 
    }); 
   
}

// initiate stripe payment 
const initialiazeStripePayment = wrapper(async (req, res) => {
    const { userId } = req; 
    const user = await User.findOne({
        where: { id: userId }, include: [
            {
                model: Cart,
                as: 'cart'
            }
        ]
    });
    if (!user) {
        throw new NotFoundError("User not found");
    }
    //define necessary variables 
    const totalPrice = user.cart.totalPrice;
    const email = user.email;

    // create a stripe session 
    const session = await stripe.checkout.session.create({
        customer_email: email,
        payment_method_types: ['card'],
        line_items: [
            {
                priceData: {
                    currency: 'usd',
                    unit_amount: totalPrice * 100
                }
            }
        ],
        mode: 'payment',
        success_url: ''
    }); 

    res.status(StatusCodes.OK).json(session.url); 

});







module.exports = {
    initializePayment,
    verifyPayment,
    paystackwebhook, 
    initialiazeStripePayment
}; 
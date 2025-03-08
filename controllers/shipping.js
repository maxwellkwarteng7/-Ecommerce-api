const { StatusCodes } = require("http-status-codes");
const wrapper = require("express-async-handler");
const { Cart, Address, User } = require("../models");
const { BadRequestError, NotFoundError } = require("../errors");

const postAddress = wrapper(async (req, res) => {
    const { fullName, phone, address1, address2, country, city, state } = req.body;
    const { userId } = req;
    if (!fullName || !phone || !address1 || !country || !city || !state) throw new BadRequestError('All fields are required except address1');
    // find the cart 
    const cart = await Cart.findOne({ where: { userId } });
    await Address.create({
        fullName,
        phone,
        address1,
        address2,
        country,
        state,
        city,
        userId,
        cartId: cart.id
    });

    res.status(StatusCodes.CREATED).json('Address created');
});


const getUserAddresses = wrapper(async (req, res) => {
    const { userId } = req;
    // find the user 
    const userAddresses = await User.findOne({
        where: { id: userId }, include: [
            {
                model: Address,
                as: 'Shipping_address', 
            }
        ], 
        order: [[{ model: Address, as: 'Shipping_address' }, 'createdAt', 'DESC']]
    });
    if (!userAddresses) return res.status(StatusCodes.OK).json([]);
    res.status(StatusCodes.OK).json(userAddresses.Shipping_address);
});

const updateUserAddress = wrapper(async (req, res) => {
    const { addressId } = req.params;
    const { userId } = req;

    const { fullName, phone, address1, address2, country, city, state } = req.body;

    if (!addressId) throw new BadRequestError('No address Id provided');

    if (!fullName || !phone || !address1 || !country || !city || !state) throw new BadRequestError('All fields are required except address1');

    // find the address 
    const address = await Address.findOne({ where: { id: addressId } });

    if (!address) throw new NotFoundError(`No address with this id : ${addressId} found`);

    // update the address with the new values 
    Object.assign(address, {
        fullName,
        phone,
        address1,
        address2,
        city,
        country,
        state
    });
    address.save();

    res.status(StatusCodes.OK).json('Address updated');
}); 

// remove User address

const deleteUserAddress = wrapper(async (req, res) => {
    const { addressId } = req.params; 
    if (!addressId) throw new BadRequestError('No address id provided'); 

    // find and destroy the address 
    const address = await Address.destroy({ where: { id: addressId } }); 
    if (address === 0) throw new NotFoundError(`No address with this id : ${addressId} was found`); 

    res.status(StatusCodes.OK).json('address deleted');
}); 





module.exports = {
    postAddress,
    getUserAddresses, 
    updateUserAddress, 
    deleteUserAddress
}
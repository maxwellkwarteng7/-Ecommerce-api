const { StatusCodes } = require("http-status-codes");
const wrapper = require("express-async-handler");
const { Cart, CartItems, Product, sequelize } = require("../models");
const { BadRequestError, NotFoundError } = require("../errors");

async function addProductToCart(cartItems, userId) {
  return sequelize.transaction(async (transaction) => {
    let cart = await Cart.findOne({ where: { userId }, transaction });

    if (!cart) {
      cart = await Cart.create({ userId, totalPrice: 0 }, { transaction });
    }

    const cartId = cart.id;

    for (let item of cartItems) {
      let product = await Product.findOne({
        where: { id: item.productId },
        transaction,
      });
      if (!product) throw new NotFoundError("Product not found");

      let cartItem = await CartItems.findOne({
        where: { cartId, productId: item.productId },
        transaction,
      });

      if (cartItem) {
          cartItem.quantity = item.quantity;
        cartItem.subTotal =
          cartItem.quantity * (Number(product.discountPrice) || product.price);
        await cartItem.save({ transaction });
      } else {
        await CartItems.create(
          {
            cartId,
            productId: item.productId,
            quantity: item.quantity,
            subTotal: item.quantity * (Number(product.discountPrice) || product.price),
          },
          { transaction }
        );
      }
    }

    cart.totalPrice = await CartItems.sum("subTotal", {
      where: { cartId },
      transaction,
    });
    await cart.save({ transaction });

    return cart;
  });
}

const addToCart = wrapper(async (req, res) => {
  const { cartItemsArray } = req.body;
  if (!cartItemsArray || !Array.isArray(cartItemsArray)) {
    throw new BadRequestError("cart Items are required or must be an array");
  }
  const { userId } = req;
  const userCart = await addProductToCart(cartItemsArray, userId);

  res.status(StatusCodes.OK).json({ message: userCart });
});

const userCart = wrapper(async (req, res) => {
  const { userId } = req;
  const userCartItems = await Cart.findOne({
    where: { userId },
    include: [
      {
        model: CartItems,
        as: "cartItems",
      },
    ],
  });
  res.status(StatusCodes.OK).json(userCartItems.cartItems);
});

module.exports = {
  addToCart,
  userCart,
};

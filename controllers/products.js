const { StatusCodes } = require("http-status-codes");
const wrapper = require("express-async-handler");
const {  Product , Reviews } = require("../models");
const { BadRequestError, NotFoundError } = require("../errors");

const getAllProducts = wrapper(async (req, res) => {
    // fetch products 
    const products = await Product.findAll({});
    // send products response 
    res.status(StatusCodes.OK).json({ messsage: products });
});

const postProduct = wrapper(async (req, res) => {
    const { price, description, name, categoryId, stock } = req.body;
    if (!price || !description || !name || !categoryId || !stock || !req.file) {
        throw new BadRequestError('All fields are required');
    }
    // save the product
    const product = await Product.create({
        price,
        description,
        stock,
        image: req.file.path,
        name,
        categoryId,
    });

    res.status(StatusCodes.CREATED).json({ message: product });

});

const updateProduct = wrapper(async (req, res) => {
    const { id } = req.params;
    const { price, description, name, categoryId, stock } = req.body;
    console.log(price, description, name, categoryId, stock, req.file.path)

    if (!price || !description || !name || !categoryId || !stock | !req.file) {
        throw new BadRequestError('All fields are required');
    }
    // find the product 
    const product = await Product.findOne({ where: { id } });

    if (!product) {
        throw new NotFoundError(`No product with id : ${id} found`);
    }
    // update the product
    product.name = name;
    product.price = price;
    product.categoryId = categoryId;
    product.stock = stock;
    product.description = description;
    product.image = req.file.path;
    await product.save();

    res.status(StatusCodes.OK).json({ message: "Product updated successfully" });
    res
        .status(StatusCodes.OK)
        .json({ messsage: `this is the product to update ${id}` });
});

const deleteProduct = wrapper(async (req, res) => {
    const { id } = req.params;
    // delete the product by id 
    const deletedProduct = await Product.destroy({ where: { id } }); 
    if (deletedProduct === 0) {
        throw new NotFoundError(`No product with this id: ${id} found`)
    }
    res
        .status(StatusCodes.OK)
        .json({ messsage: 'Product deleted successfully'});
});

const getProductAndReviews = wrapper(async (req, res) => {
    const { id } = req.params;
    // find the product with it's reviews 
    const productAndReviews = await Product.findOne({
        where: { id }, include: [
            {
                model: Reviews,
                as: 'reviews'
            }
        ]
    });
    if (!productAndReviews) {
        throw new NotFoundError(`No product with this id : ${id} found`);
    }
    res.status(StatusCodes.OK).json({ message: productAndReviews });
});

module.exports = {
    getAllProducts,
    postProduct,
    updateProduct,
    deleteProduct,
    getProductAndReviews
};

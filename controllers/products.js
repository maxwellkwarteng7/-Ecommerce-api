const { StatusCodes } = require("http-status-codes");
const wrapper = require("express-async-handler");
const {  Product , Reviews , ProductTag } = require("../models");
const { BadRequestError, NotFoundError } = require("../errors");

const getAllProducts = wrapper(async (req, res) => {
    // fetch products 
    const products = await Product.findAll({});
    // send products response 
    res.status(StatusCodes.OK).json({ messsage: products });
});

const postProduct = wrapper(async (req, res) => {
    const { price, description, name, categoryId, stock ,tagId , discountPrice } = req.body;
    if (!price || !description || !name || !categoryId || !stock || !req.file) {
        throw new BadRequestError('price , description , name , category and stock are required fields');
    }
    // save the product
    const product = await Product.create({
        price,
        description,
        stock,
        image: req.file.path,
        name,
        categoryId,
        tagId, 
        discountPrice
    });

    res.status(StatusCodes.CREATED).json({ message: product });

});

const updateProduct = wrapper(async (req, res) => {
    const { id } = req.params;
    const { price, description, name, categoryId, stock, tagId, discountPrice } = req.body;
    
    if (!price || !description || !name || !categoryId || !stock || !tagId || !discountPrice) {
        throw new BadRequestError('All fields are required');
    }
    // find the product 
    const product = await Product.findOne({ where: { id } });

    if (!product) {
        throw new NotFoundError(`No product with id : ${id} found`);
    }

    // update the product
    Object.assign(product, {
        name,
        tagId,
        discountPrice,
        price,
        categoryId,
        stock,
        description
    });

    if (req.file) {
        product.image = req.file.path;
    }
    await product.save();

    res.status(StatusCodes.OK).json({ message: "Product updated successfully" });
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

const getSingleProduct = wrapper(async (req, res) => {
    const { id } = req.params;
    // find the product with it's reviews 
    const singleProduct = await Product.findOne({
        where: { id }
    });
    if (!singleProduct) {
        throw new NotFoundError(`No product with this id : ${id} found`);
    }
    res.status(StatusCodes.OK).json(singleProduct);
});

const createProductTag = wrapper(async (req, res) => {
    const { name } = req.body; 
    if (!name) {
        throw new BadRequestError('Product tag name is required');
    }
    const createdTag = await ProductTag.create({ name }); 
    res.status(StatusCodes.OK).json({ message: createdTag }); 
    
}); 

const removeTag = wrapper(async (req, res) => {
    const { id } = req.params;
    // find the tag and delete it 
    await ProductTag.destroy({ where: { id } });
    res.status(StatusCodes.OK).json({ message: 'Product tag deleted' });
}); 

const updateProductTag = wrapper(async (req, res) => {
    const { name } = req.body; 
    const { id } = req.params; 
    //find the product with this id 
    const productTag = await ProductTag.findOne({ where: { id } });
    if (!productTag) throw new NotFoundError(`No product tag with this id : ${id} found`);
    
    // update the product tag 
    productTag.name = name; 
    productTag.save(); 
    res.status(StatusCodes.OK).json({ message: "Product tag updated" }); 
})

// get product by tag 
const getProductByTag = wrapper(async (req, res) => {
    const {tag} = req.query;
    if (!tag) {
        throw new BadRequestError('Query string tag was not provided or is empty'); 
    }
    // use the products using the tag
    const productTag = await ProductTag.findOne({
        where: { name: tag }, include: [
            {
                model: Product,
                as: 'products'
            }
        ]
    });
    if (!productTag) throw new NotFoundError('No product tag found'); 
    
    res.status(StatusCodes.OK).json(productTag.products); 
});


module.exports = {
    getAllProducts,
    postProduct,
    updateProduct,
    deleteProduct,
    getSingleProduct, 
    createProductTag, 
    removeTag, 
    updateProductTag,
    getProductByTag
};

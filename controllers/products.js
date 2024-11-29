
const { StatusCodes } = require("http-status-codes");
const wrapper = require("express-async-handler");


const getAllProducts = wrapper(async (req, res) => {
    res.status(StatusCodes.OK).json({ messsage: "All products here" });
});

const postProduct = wrapper(async (req, res) => {
    const { name, description, price, category } = req.body; 
    if (!name || !description || !price || !category) {
        res.status(StatusCodes.BAD_REQUEST).json({ error: "All fields are required" }); 
    }
    res.status(StatusCodes.OK).json({ messsage: "post a product" });
});

const updateProduct = wrapper(async (req, res) => {
    const { id } = req.params; 
    console.log("this is the update request id ", id); 

    res.status(StatusCodes.OK).json({ messsage: `this is the product to update ${id}` });
});

const deleteProduct = wrapper(async (req, res) => {
    const { id } = req.params; 
  

    res.status(StatusCodes.OK).json({ messsage: `delete a product with id : ${id}` });
});




module.exports = {
    getAllProducts,
    postProduct,
    updateProduct,
    deleteProduct
}
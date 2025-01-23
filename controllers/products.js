
const { StatusCodes } = require("http-status-codes");
const wrapper = require("express-async-handler");


const getAllProducts = wrapper(async (req, res) => {
    res.status(StatusCodes.OK).json({ messsage: "All products here" });
});

const postProduct = wrapper(async (req, res) => {
    if ( !req.files || req.files.length === 0) {
        return res.status(StatusCodes.BAD_REQUEST).json({ error: "At least one image is required" }); 
    }

    const imageUrl = req.files.map((file) => file.url); 
   
    const { name, description, price, category } = req.body; 
    if (!name || !description || !price || !category) {
        return res.status(StatusCodes.BAD_REQUEST).json({ error: "All fields are required" }); 
    }
    // save the product information 
    console.log(name, description, price, category, imageUrl); 

    res.status(StatusCodes.OK).json({ messsage: "post a product" });
});

const updateProduct = wrapper(async (req, res) => {
    const { id } = req.params; 
   

    res.status(StatusCodes.OK).json({ messsage: `this is the product to update ${id}` });
});

const deleteProduct = wrapper(async (req, res) => {
    const { id } = req.params; 
  
    console.log(id);
    res.status(StatusCodes.OK).json({ messsage: `Delete a product with id : ${id}` });
});




module.exports = {
    getAllProducts,
    postProduct,
    updateProduct,
    deleteProduct
}
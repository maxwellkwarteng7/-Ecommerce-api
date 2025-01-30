
const { StatusCodes } = require("http-status-codes");
const wrapper = require("express-async-handler");
const { Category } = require('../models'); 

const getAllProducts = wrapper(async (req, res) => {
    res.status(StatusCodes.OK).json({ messsage: "All products here" });
});

const postProduct = wrapper(async (req, res) => {
    try {
    // Check if file exists
    if (!req.file) {
      return res.status(StatusCodes.BAD_REQUEST).json({ message: 'image is a required field' });
        }
        // the image path /url 
        const image = req.file.path; 
        // Respond to the client
        const { price, description, name, category } = req.body;     
        if (!price || !description || !name || !category) {
            console.log(price, description, category, name);
            return res.status(StatusCodes.BAD_REQUEST).json({ error: "All fields are required" }); 
        }
        console.log(name, description, price, category, image); 
   
  } catch (err) {
    console.error('Error uploading file:', err.message);
    res.status(500).json({ message: 'Failed to upload file', error: err.message });
  }
});

const updateProduct = wrapper(async (req, res) => {
    const { id } = req.params; 
 
   

    res.status(StatusCodes.OK).json({ messsage: `this is the product to update ${id}` });
});


const deleteProduct = wrapper(async (req, res) => {
    const { id } = req.params; 


    res.status(StatusCodes.OK).json({ messsage: `Delete a product with id : ${id}` });
});


// create a category




module.exports = {
    getAllProducts,
    postProduct,
    updateProduct,
    deleteProduct, 
}
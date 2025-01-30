
const { StatusCodes } = require("http-status-codes");
const wrapper = require("express-async-handler");
const { Category } = require('../models'); 


const createCategory = wrapper(async (req, res) => {
    const { name } = req.body; 
    if ( !req.file || !name) {
        return res.status(StatusCodes.BAD_REQUEST).json({ error: 'name and image fields are  required' }); 
    }
    const image = req.file.path;
    try {
        const category = await Category.create({ name , image}); 
        res.status(StatusCodes.CREATED).json({ message: category }); 
    } catch (error) { 
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: "error creating category" }); 
    }
}); 


const updateCategory = wrapper(async (req, res) => {
    const { id } = req.params; 
    console.log("update id : " ,id); 
}); 



const deleteCategory = wrapper(async (req, res) => {
    const { id } = req.params; 
    console.log("delete id : " ,id); 
});


const categoryProducts  = wrapper(async (req, res) => {
    const { categoryId } = req.params; 
    console.log("category id : " ,categoryId); 
});




module.exports = {
    createCategory, 
    updateCategory, 
    deleteCategory, 
    categoryProducts
}

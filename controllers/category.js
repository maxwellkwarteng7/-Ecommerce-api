
const { StatusCodes } = require("http-status-codes");
const wrapper = require("express-async-handler");
const { Category , Product } = require('../models'); 


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
       if (!id) {
        return res.status(StatusCodes.BAD_REQUEST).json({error : "No id provided"})
    }
    // check the payload coming 
    const { name } = req.body; 
    if (!name || !req.file) {
        return res.status(StatusCodes.BAD_REQUEST).json({ error: "name and image fields cannot be empty" }); 
    }
    // find the category 
    try {
          const specificCategory = await Category.findOne({ where: { id } }); 

    if (!specificCategory) {
        return res.status(StatusCodes.NOT_FOUND).json({ error: `No category with this  id ${id} found`});
        }
        // if category is there , save with updated info 
        specificCategory.name = name; 
        specificCategory.image = req.file.path; 
        await specificCategory.save(); 
    
        res.status(StatusCodes.OK).json({ message : "Category updated Successfully" }); 
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message }); 
    }
}); 



const deleteCategory = wrapper(async (req, res) => {
    const { id } = req.params; 
    // find and delete the category
    if (!id) {
        return res.status(StatusCodes.BAD_REQUEST).json({error : "No id provided"})
    }
    try {
        const deletedCategory = await Category.destroy({ where: { id } });    
        if (deletedCategory === 0) {
            return res.status(StatusCodes.NOT_FOUND).json({ error: "category with this id not found" }); 
        } 
        res.status(StatusCodes.OK).json({
            message : "Category successfully deleted"
         }); 
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({error: "Error deleting category"}); 
    }
});


const getCategoryProducts  = wrapper(async (req, res) => {
    const { categoryId } = req.params; 
    if (!categoryId) {
        return res.status(StatusCodes.BAD_REQUEST).json({ error: "No category Id provided" }); 
    }
    try {
         const categoryProducts = await Category.findOne({
        where: { id : categoryId }, include: [
            {
                model: Product,
                as: 'products'
            }
        ]
    }); 

    res.status(StatusCodes.OK).json({ message: categoryProducts });
    } catch (error) {
        console.log(error); 
     res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: "Error fetching category products" });  
    }
});


const allCategories = wrapper(async (req, res) => {
    // fetch all categories 
    try {
        const categories = await Category.findAll({});   
    res.status(StatusCodes.OK).json({ message: categories });

    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: "Error fetching categories" }); 
    }
});




module.exports = {
    createCategory, 
    updateCategory, 
    deleteCategory, 
    getCategoryProducts , 
    allCategories
}

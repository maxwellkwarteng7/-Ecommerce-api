const { StatusCodes } = require("http-status-codes");
const wrapper = require("express-async-handler");
const { Category, Product } = require("../models");
const { BadRequestError, NotFoundError } = require("../errors");


const createCategory = wrapper(async (req, res) => {
  const { name } = req.body;
  if (!req.file || !name) throw new BadRequestError('name and image fields are  required'); 

  const image = req.file.path;

  const category = await Category.create({ name, image });
  res.status(StatusCodes.CREATED).json({ message: category });
});

const updateCategory = wrapper(async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ error: "No id provided" });
  }
  // check the payload coming
  const { name } = req.body;
  if (!name || !req.file) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ error: "name and image fields cannot be empty" });
  }
  // find the category
  const specificCategory = await Category.findOne({ where: { id } });

  if (!specificCategory) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ error: `No category with this  id ${id} found` });
  }
  // if category is there , save with updated info
  specificCategory.name = name;
  specificCategory.image = req.file.path;
  await specificCategory.save();

  res.status(StatusCodes.OK).json({ message: "Category updated Successfully" });
});

const deleteCategory = wrapper(async (req, res) => {
  const { id } = req.params;
  // find and delete the category
  if (!id) throw new BadRequestError('No id provided'); 

  const deletedCategory = await Category.destroy({ where: { id } });
  if (deletedCategory === 0) throw new NotFoundError('category with this id not found');

  res.status(StatusCodes.OK).json({
    message: "Category successfully deleted",
  });
});

const getCategoryProducts = wrapper(async (req, res) => {
  const { categoryId } = req.params;
  let limit = parseInt(req.query.limit) || 12;
  let page = parseInt(req.query.page) || 1;
  let offset = (page - 1) * limit;

  if (!categoryId) throw new BadRequestError('No category Id provided');

  const productCount = await Product.count({ where: { categoryId } }); 


  const result = await Category.findOne({
    where : {id : categoryId} , 
    include: [
      {
        model: Product,
        as: 'products', 
        limit,
        offset, 
        order : [['createdAt' , 'DESC']]
      },
    ]
  });
    
  res.status(StatusCodes.OK).json({
    currentPage: page, 
    totalPages: Math.ceil(productCount / limit),
    products : result.products
  });
});

const allCategories = wrapper(async (req, res) => {
  // fetch all categories
  const categories = await Category.findAll({});
  res.status(StatusCodes.OK).json(categories);
});

module.exports = {
  createCategory,
  updateCategory,
  deleteCategory,
  getCategoryProducts,
  allCategories,
};

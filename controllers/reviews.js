const { StatusCodes } = require("http-status-codes");
const wrapper = require("express-async-handler");
const { Reviews , User , Product } = require("../models");
const { BadRequestError, NotFoundError, UnauthorizedError } = require("../errors");




const addReview = wrapper(async (req, res) => {
    const { rating, comment, productId } = req.body; 
    const { userId, role } = req;
    if (role === 'admin') throw new UnauthorizedError('Create account as a customer or login as one to add a review');

    if (!rating || !comment || !productId) throw new BadRequestError('rating , comment and productId are required fields'); 
    // first verify if the product Id exist 
    const product = await Product.findOne({ where: { id: productId } }); 
    if (!product) throw new NotFoundError(`No product with id ${productId} found`); 

    // Add  the review
    const review = await Reviews.create({ userId, rating, comment, productId }); 


    res.status(StatusCodes.CREATED).json({ message: "Review Added successfully" , review  });

}); 

// update a review 
const updateReview = wrapper(async (req, res) => {
    const { comment, rating } = req.body;
    const { id } = req.params; 
    if (!id || !comment || !rating) throw new BadRequestError('comment , rating and id are required fields for a review update'); 
    // find the review 
    const singleReview = await Reviews.findOne({ where: { id } });
    if (!singleReview) throw new NotFoundError('No review with this id was found');
    Object.assign(singleReview, {
        comment,
        rating
    });
    singleReview.save();
    res.status(StatusCodes.OK).json({ message: "Review updated" });
});

const deleteReview = wrapper(async (req, res) => {
    const { id } = req.params;
    if (!id) throw new BadRequestError('Provide an id for the review you want to delete');
    // find and delete the review 
    const review = await Reviews.destroy({ where: { id } });
    if (review === 0) throw new NotFoundError('Review not found');
    res.status(StatusCodes.OK).json({ message: "Review deleted successfully" });
}); 

// fetch product reviews 
const productReviews = wrapper(async (req, res) => {
    const { productId } = req.params; 
    if (!productId) throw new BadRequestError('No productId provided');
    let limit = parseInt(req.query.limit) || 5; 
    let page = parseInt(req.query.page) || 1; 
    let offset = (page - 1) * limit; 

    //fetching product with limit 
    const { count, rows: reviews } = await Reviews.findAndCountAll({
        where: { productId },
        include: [
            {
                model: User, 
                attributes : ['username']
           }
        ],
        limit,
        offset,
        order: [['createdAt', 'DESC']]
    });
    res.status(StatusCodes.OK).json({
        totalReviews: count,
        currentPage: page,
        totalPages: Math.ceil(count / limit),
        reviews,
    });
});


module.exports = {
    productReviews, 
    addReview, 
    updateReview, 
    deleteReview
}
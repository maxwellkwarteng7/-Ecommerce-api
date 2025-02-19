const { StatusCodes } = require("http-status-codes");
const wrapper = require("express-async-handler");
const { Reviews } = require("../models");
const { BadRequestError, NotFoundError } = require("../errors");



const addReview = wrapper(async (req, res) => {
    const { rating, comment, productId } = req.body; 
    const { userId } = req;
    if (!rating || !comment || !productId) throw new BadRequestError('rating , comment and productId are required fields'); 

    // Add  the review
    const review = await Reviews.create({ userId, rating, comment, productId }); 

    res.status(StatusCodes.CREATED).json({ message: "Review Added successfully" });

}); 

// update a review 
const updateReview = wrapper(async (req, res) => {
    const { id , comment  , rating } = req.body;
    // find the review 
    const singleReview = await Reviews.findOne({ where: { id } }); 
    if (!singleReview) throw new NotFoundError('No review with this id was found'); 
    Object.assign(singleReview, {
        comment,
        rating
    });
    singleReview.save(); 
    res.status(StatusCodes.OK).json({ message: "Review updated" }); 


})
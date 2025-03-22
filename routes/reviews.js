const express = require('express'); 
const { productReviews, addReview, updateReview, deleteReview } = require('../controllers/reviews');
const validateToken = require('../middlewares/tokenValidator');
const router = express.Router(); 



router.get("/product-reviews/:productId", productReviews); 
router.use(validateToken);
router.post('/', addReview); 
router.patch('/:id', updateReview); 
router.delete("/:id", deleteReview); 


module.exports = router; 
const express = require('express');
const { userOrders, getUserOrderItems } = require('../controllers/orders');
const validateToken = require('../middlewares/tokenValidator');
const router = express.Router();


router.get('/', userOrders); 
router.get('/:orderId', getUserOrderItems); 






module.exports = router; 
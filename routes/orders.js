const express = require('express');
const { userOrders } = require('../controllers/orders');
const validateToken = require('../middlewares/tokenValidator');
const router = express.Router();


router.get('/' , userOrders); 






module.exports = router; 
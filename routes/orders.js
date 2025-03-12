const express = require('express');
const { userOrders } = require('../controllers/orders');
const router = express.Router();


router.get('/' , userOrders); 






module.express = router; 
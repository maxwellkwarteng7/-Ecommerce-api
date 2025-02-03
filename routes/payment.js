const express = require('express'); 
const { pay } = require('../controllers/paystack');
const router = express.Router(); 

router.post('/pay', pay); 







module.exports = router; 
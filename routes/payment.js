const express = require('express'); 
const { pay } = require('../controllers/paystack');
const validateToken = require('../middlewares/tokenValidator');
const router = express.Router();



router.post('/pay', validateToken , pay); 


module.exports = router; 
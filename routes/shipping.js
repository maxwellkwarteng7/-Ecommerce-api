const express = require('express'); 
const { getUserAddresses, postAddress } = require('../controllers/shipping');
const router = express.Router();

router.get('/', getUserAddresses); 
router.post('/', postAddress); 

module.exports = router; 
const express = require('express'); 
const { getUserAddresses, postAddress, updateUserAddress, deleteUserAddress } = require('../controllers/shipping');
const { route } = require('./auth');
const router = express.Router();

router.get('/', getUserAddresses); 
router.post('/', postAddress); 
router.put('/:addressId', updateUserAddress);
router.delete('/:addressId', deleteUserAddress);  

module.exports = router; 
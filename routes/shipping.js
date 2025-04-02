const express = require('express'); 
const { getUserAddresses, postAddress, updateUserAddress, deleteUserAddress } = require('../controllers/shipping');
const router = express.Router();

router.get('/', getUserAddresses); 
router.post('/', postAddress); 
router.patch('/:addressId', updateUserAddress);
router.delete('/:addressId', deleteUserAddress);  

module.exports = router; 
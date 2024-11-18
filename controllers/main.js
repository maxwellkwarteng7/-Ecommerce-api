const express = require('express'); 
const router = express.Router(); 
const wrapper = require('express-async-handler'); 
const { StatusCodes } = require('http-status-codes');

const home = wrapper(async (req, res) => {
    const userId = req.userId; 
    res.status(StatusCodes.OK).json({ message: "You hit the home route", id : userId});
});


module.exports = {
    home 
}
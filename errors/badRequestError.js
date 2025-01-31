const { StatusCodes
} = require('http-status-codes'); 
const CustomApiError = require('./customApiError');

class BadRequestError extends CustomApiError {
     statusCode; 
    constructor(message) {
        super(message); 
        this.statusCode = StatusCodes.BAD_REQUEST; 
    }
}


module.exports = BadRequestError; 
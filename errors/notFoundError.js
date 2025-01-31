const { StatusCodes
} = require('http-status-codes'); 
const CustomApiError = require('./customApiError');
 
class NotFoundError extends CustomApiError {
     statusCode; 
    constructor(message) {
        super(message); 
        this.statusCode = StatusCodes.NOT_FOUND; 
    }
}


module.exports = NotFoundError; 


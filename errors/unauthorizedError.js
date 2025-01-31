const { StatusCodes
} = require('http-status-codes'); 
const CustomApiError = require('./customApiError');
 
class UnauthorizedError extends CustomApiError {
     statusCode; 
    constructor(message) {
        super(message); 
        this.statusCode = StatusCodes.UNAUTHORIZED; 
    }
}


module.exports = UnauthorizedError; 
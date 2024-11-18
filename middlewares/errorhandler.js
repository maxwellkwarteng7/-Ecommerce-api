const { StatusCodes } = require("http-status-codes")
const { ValidationError } = require("sequelize")

const errorhandler = (req, res,  err) => {
    if (err instanceof ValidationError) {
       return  res.status(StatusCodes.BAD_REQUEST).json({ error: err }); 
    }
     res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error : err.message }); 
}


module.exports = errorhandler; 
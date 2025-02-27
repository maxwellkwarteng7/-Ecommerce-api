const { StatusCodes } = require("http-status-codes");
const { ValidationError } = require("sequelize");
const CustomApiError = require("../errors/customApiError");

const errorhandler = (err, req, res, next) => {
    res.setHeader('Content-Type', 'application/json');  
    if (err instanceof ValidationError) {
        return res.status(StatusCodes.BAD_REQUEST).json({ error: err.errors[0].message });
    }

    if (err instanceof CustomApiError) {
        return res.status(err.statusCode).json({ error: err.message });
    }

    // Catch-all for unexpected errors
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: err.message || "Something went wrong" });
};

module.exports = errorhandler;

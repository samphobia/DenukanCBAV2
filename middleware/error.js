const ErrorResponse = require("../utils/errorResponse");

const errorHandler = (err, req, res, next) => {
   let error = { ...err };

   error.message = err.message;
   //log to the console to know whats is inside the err
   console.log(err);

   //Mongoose bad object
   if (err.name === "CastError") {
      const message = `Resource was not found`;
      error = new ErrorResponse(message, 404);
   }

   //Mongoose Duplicate key
   if (error.code === 11000) {
      const message =
         "A field in the data you entered is meant to be a unique key and it already exist in the database";
      error = new ErrorResponse(message, 400);
   }

   res.status(error.statusCode || 500).json({
      success: false,
      error: error.message || "Server Error",
      data: null,
   });
};

module.exports = errorHandler;

// class ErrorResponse extends Error {
//   constructor(message, statusCode) {
//      super(message);
//      this.statusCode = statusCode;
//   }
// }

// module.exports = ErrorResponse;

ErrorResponse = (req, res, next) => {
  // Define a function to send success responses
  res.sendSuccess = (data, message = 'Request successful', status = 200) => {
    res.status(status).json({
      success: true,
      message,
      data,
    });
  };

  // Define a function to send error responses
  res.sendError = (message = 'Internal Server Error', status = 500) => {
    res.status(status).json({
      success: false,
      message,
    });
  };

  // Continue to the next middleware
  next();
};

module.exports = ErrorResponse;

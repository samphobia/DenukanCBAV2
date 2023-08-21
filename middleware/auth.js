const jwt = require("jsonwebtoken");
const asyncHandler = require("./async");
const ErrorResponse = require("../utils/errorResponse");
const User = require("../models/user");

// Protect routes
// Where ever we want to use this we just have to pass it as a first parameter
exports.protectRoute = asyncHandler(async (req, res, next) => {
   let token;
   if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
   ) {
      //set token from header
      token = req.headers.authorization.split(" ")[1];

      //set token from cookie
   }
   // else if (req.cookies.token) {
   //    token = req.cookies.token;
   // }

   // Make sure token exists
   if (!token) {
      return next(
         new ErrorResponse("Not authorized to access this route", 401)
      );
   }

   try {
      // Verify token if it was signed with our secret valid token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      console.log(decoded);

      req.user = await User.findById(decoded.id);

      next();
   } catch (err) {
      return next(new ErrorResponse("Not authorize to access this route", 401));
   }
});

//Grant access to specific roles
exports.authorizeRole = (...roles) => {
   return (req, res, next) => {
      if (!roles.includes(req.user.role)) {
         return next(
            new ErrorResponse(
               `User role ${req.user.role} is not authorized to access this route`,
               403
            )
         );
      }
      next();
   };
};

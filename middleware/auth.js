const jwt = require("jsonwebtoken");
const asyncHandler = require("./async");
const ErrorResponse = require("../utils/errorResponse");
const Merchant = require("../models/Merchants");

// Protect routes
// Where ever we want to use this we just have to pass it as a first parameter
// exports.protectRoute = asyncHandler(async (req, res, next) => {
//    let token;
//    if (
//       req.headers.authorization &&
//       req.headers.authorization.startsWith("Bearer")
//    ) {
//       //set token from header
//       token = req.headers.authorization.split(" ")[1];

//       //set token from cookie
//    }
//    // else if (req.cookies.token) {
//    //    token = req.cookies.token;
//    // }

//    // Make sure token exists
//    if (!token) {
//       return next(
//          new ErrorResponse("Not authorized to access this route", 401)
//       );
//    }

//    try {
//       // Verify token if it was signed with our secret valid token
//       const decoded = jwt.verify(token, process.env.JWT_SECRET);

//       console.log(decoded);

//       req.Merchant = await Merchant.findByPk(decoded.id);

//       next();
//    } catch (err) {
//       return next(new ErrorResponse("Not authorize to access this route", 401));
//    }
// });

// //Grant access to specific roles
// exports.authorizeRole = (...merchantId) => {
//    return (req, res, next) => {
//       if (!merchantId.includes(req.Merchant)) {
//          return next(
//             new ErrorResponse(
//                `User ${req.user.role} is not authorized to access this route`,
//                403
//             )
//          );
//       }
//       next();
//    };
// };

exports.authorizeRoute = async (req, res, next) => {
  // Get the token from the request headers or cookies
  let token;
     if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
     ) {
        //set token from header
        token = req.headers.authorization.split(" ")[1];
  
        //set token from cookie
     }

  if (!token) {
    return res.status(401).json({
      message: "Not Authorized to access this route",
    });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find the merchant by ID from the decoded token
    const merchant = await Merchant.findByPk(decoded.id);

    if (!merchant) {
      return res.status(404).json({
        message: "Merchant Not found",
      });
    }

    // Attach the authenticated merchant to the request object
    req.merchant = merchant;

    next();
  } catch (err) {
    return res.status(401).json({
      message: "Not Authorized to access this route",
    });
  }
};


const crypto = require("crypto");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const User = require("../models/user");
// const sendEmail = require("../utils/sendEmail");

exports.getMe = async (req, res, next) => {
  try {
    const userId = req.user.id; // Assuming the user's ID is available in the request (e.g., from middleware)
   
    // Find the user by their ID
    const user = await User.findByPk(userId);

    if (!user) {
      return next(new ErrorResponse(`User not found`, 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        user
      }
    });

  } catch (err) {
    res.status(400).json({
      status: 'error',
      message: err.message
    });
  }
};
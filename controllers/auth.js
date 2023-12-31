const crypto = require("crypto");
const jwt = require('jsonwebtoken');
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const User = require("../models/Users");
const Merchant = require("../models/Merchants");
const ResetToken = require("../models/ResetToken");
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
      status: true,
      message: 'succes',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (err) {
    res.status(400).json({
      status: 'error',
      message: err.message
    });
  }
};

const setTokenCookieAndRespond = (user, statusCode, res) => {
  const token = jwt.sign({ id: user.id }, `${process.env.JWT_SECRET}`);

  res.cookie('token', token, {
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000, // Set the cookie expiration time (e.g., 1 day)
    secure: process.env.NODE_ENV === 'production' // Set 'secure' to true in production
  });

  res.status(statusCode).json({
    success: true,
    token: token,
    data: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    }
  });
};

exports.sendResetToken = async (req, res, next) => {
  try {
    const { email } = req.body;

    const merchant = await Merchant.findOne({ where: { email } });

    if (!merchant) {
      return next(new ErrorResponse('Merchant not found', 404));
    }

    // Generate a reset token with the merchant's ID and expiration time
    const resetToken = jwt.sign(
      { id: merchant.id },
      process.env.JWT_SECRET,
      { expiresIn: '1h' } // Set the token expiration time
    );

    // Store the reset token in the database
    await ResetToken.create({
      email: email,
      resetToken,
      expiresAt: new Date(new Date().getTime() + 60 * 60 * 1000), // 1 hour
    });

    // Send an email to the merchant with a link containing the resetToken
    const url = `${process.env.BASE_URL}/reset-password?token=${resetToken}`;
    sendResetEmail(merchant.name, url);

    res.status(200).json({
      status: 'success',
      message: 'Reset token sent successfully',
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: err.message,
    });
  }
};
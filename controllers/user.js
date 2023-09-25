const bcrypt = require('bcrypt');
const { Sequelize } = require('sequelize');
const { ErrorResponse } = require('../utils/errorResponse');
const User = require("../models/User");
const Merchant = require("../models/Merchant");
const jwt = require('jsonwebtoken')

// Assuming you have the User and Merchant models already defined

exports.createUser = async (req, res, next) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    
    // Extract the merchantId from the JWT token in the request header
    const token = req.header('Authorization'); // Assuming the token is sent in the Authorization header
    if (!token) {
      return next(new ErrorResponse(`Authorization token not provided`, 401));
    }
    
    // Verify and decode the JWT token to get the merchantId
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Adjust the secret accordingly
    const merchantId = decoded.merchantId;

    // Check if the merchant exists (optional, you might have already checked during authentication)
    const merchant = await Merchant.findOne({ where: { id: merchantId } });
    if (!merchant) {
      return next(new ErrorResponse(`Merchant not found`, 404));
    }

    // Hash the password before saving to the database
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user associated with the merchant
    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      merchantId,
    });

    res.status(201).json({
      status: 'success',
      data: {
        user,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'error',
      message: err.message,
    });
  }
};

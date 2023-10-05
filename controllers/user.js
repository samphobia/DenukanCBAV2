const bcrypt = require('bcrypt');
const { Sequelize } = require('sequelize');
const { ErrorResponse } = require('../utils/errorResponse');
const User = require("../models/User");
const Merchant = require("../models/Merchants");
const jwt = require('jsonwebtoken');
const { sendUserMail } = require('../middleware/mailer');

// Assuming you have the User and Merchant models already defined

exports.createUser = async (req, res, next) => {
  try {
    const { firstName, lastName, email, role, password } = req.body;
    const merchantId = req.merchant.id
    
    // Extract the merchantId from the JWT token in the request header
    // const token = req.header('Authorization'); // Assuming the token is sent in the Authorization header
    // if (!token) {
    //   return next(new ErrorResponse(`Authorization token not provided`, 401));
    // }
    
    // Verify and decode the JWT token to get the merchantId
    const merchant = await Merchant.findByPk(merchantId);
    // Check if the merchant exists (optional, you might have already checked during authentication)
    if (!merchant) {
      return next(new ErrorResponse(`Merchant not found`, 404));
    }

    if (role !== 'Admin' && role !== 'Manager') {
      return next(new ErrorResponse(`Please choose a role for this User`, 400))
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return next(new ErrorResponse(`User already exist`, 401))
    }

    // Hash the password before saving to the database
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user associated with the merchant
    const user = await User.create({
      firstName,
      lastName,
      email,
      role,
      password: hashedPassword,
      merchantId,
    });

    const url = `${process.env.BASE_URL}/activate/${token}`;
    sendUserMail(
      user.email,
      merchant.merchantCoreId,
      url
    );
    res.send({
      id: merchant.id,
      code: "00",
      message: "SUCCDESS",
      merchantName: merchantName,
      token: token,
      otp: savedOTP,
      message:
        "Registration Success...Please enter your OTP is the provided section on the verification page",
    });
  } catch (err) {
    res.status(400).json({
      status: 'error',
      message: err.message,
    });
  }
};

exports.userLogin = async (req, res, next) => {
  try {
    const { merchantCoreId, email, password } = req.body;
    
    // Find the associated merchant using the provided merchantCoreId
    const merchant = await Merchant.findOne({ where: { merchantCoreId } });

    // Check if the merchant exists
    if (!merchant) {
      return next(new ErrorResponse('Merchant not found', 404));
    }

    // Find the user by email
    const user = await User.findOne({ where: { email } });

    // Check if the user exists
    if (!user) {
      return next(new ErrorResponse('User not found', 404));
    }

    // Verify the password
    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
      return next(new ErrorResponse('Invalid password', 401));
    }

    // Generate a JWT token for the authenticated user
    const token = jwt.sign(
      {
        userId: user.id,
        merchantId: merchant.id,
        // You can add more claims if needed
      },
      process.env.JWT_SECRET, // Adjust this to your secret
      {
        expiresIn: process.env.JWT_EXPIRE, // Adjust the token expiration time
      }
    );

    // Send the token in the response
    res.status(200).json({
      status: 'success',
      user: {
        id: user.id,
        role: user.role,
      },
      token,
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: err.message,
    });
  }
};
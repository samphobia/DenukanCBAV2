const bcrypt = require('bcrypt');
const { Sequelize } = require('sequelize');
const { ErrorResponse } = require('../utils/errorResponse');
const User = require("../models/Users");
const Merchant = require("../models/Merchants");
const jwt = require('jsonwebtoken');
const { sendUserMail } = require('../middleware/mailer');
const { validateEmail, validatePassword, validateRequiredFields } = require('../helpers/validator');

// Assuming you have the User and Merchant models already defined


exports.createUser = async (req, res, next) => {
  try {
    const requiredFields = ['firstName', 'lastName', 'email', 'role', 'password'];
    const missingFieldsError = validateRequiredFields(req, res, requiredFields);

    if (missingFieldsError) {
      return missingFieldsError;
    }

    const { firstName, lastName, email, role, password } = req.body;
    const merchantId = req.merchant.id

    if (!validateEmail(email)) {
      return res.status(403).json({
        message: "invalid email address",
      });
    }
    
    // Extract the merchantId from the JWT token in the request header
    // const token = req.header('Authorization'); // Assuming the token is sent in the Authorization header
    // if (!token) {
    //   return next(new ErrorResponse(`Authorization token not provided`, 401));
    // }
    
    // Verify and decode the JWT token to get the merchantId
    const merchant = await Merchant.findByPk(merchantId);
    // Check if the merchant exists (optional, you might have already checked during authentication)
    if (!merchant) {
      return res.status(404).json({
        message: "Merchant not found.",
      });
    }

    if (role !== 'Admin' && role !== 'Manager') {
      return res.status(403).json({
        message: "Role not selected",
      });
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({
        message: "User with this email already exist",
      });
    }

    if (!validateLength(firstName, 3, 15)) {
      return res.status(400).json({
        message: "first name must between 3 and 30 characters.",
      });
    }
    if (!validateLength(lastName, 3, 15)) {
      return res.status(400).json({
        message: "last name must between 3 and 30 characters.",
      });
    }

    if (!validatePassword(password)) {
      return res.status(403).json({
        message: "password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character",
      });
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
    res.status(201).json({
      code: "00",
      data: {
        bearerToken: token,
        user: user
      },
      message: "User Created Successfully. A welcome mail has been sent to the User's mail",
    });
  } catch (err) {
    res.status(400).json({
      status: 'error',
      message: "User not created",
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
      return res.status(404).json({
        message: "Merchant not found.",
      });
    }

    // Find the user by email
    const user = await User.findOne({ where: { email } });

    // Check if the user exists
    if (!user) {
      return res.status(404).json({
        message: "User not found.",
      });
    }

    // Verify the password
    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
      return res.status(401).json({
        message: "Invalid password",
      });
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
      code: "00",
      status: 'success',
      user: {
        bearerToken: token,
        id: user.id,
        role: user.role,
      },
      message: "Login Successfully",

    });
  } catch (err) {
    res.status(400).json({
      status: '01',
      message: "Logi failed"
    });
  }
};

exports.getAllUsers = async (req, res, next) => {
  try {
    const user = await User.findAll();

    res.status(200).json({
      code: "00",
      status: "success",
      data: user,
    });
  } catch (err) {
    res.status(400).json({
      status: false,
      message: "failed to load all users",
    });
  }
};
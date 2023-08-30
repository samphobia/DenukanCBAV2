const jwt = require('jsonwebtoken');
const ErrorResponse = require("../utils/errorResponse");
const bcrypt = require('bcrypt');
const  User  = require('../models/user');

exports.createUser = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    if (!email || !password) {
      return next(new ErrorResponse(`Please provide email and password`, 400))
    }
    
    if (role !== 'Admin' && role !== 'Merchant') {
      return next(new ErrorResponse(`Please choose a role for this User`, 400))
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return next(new ErrorResponse(`User already exist`, 401))
    }

    // Hash the password before saving to the database
    const hashedPassword = await bcrypt.hash(password, 10);


    
    // Create a new user object with the hashed password
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role
    });

    // Generate a JWT token with user ID and secret key
    const token = jwt.sign({ id: newUser.id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE});

    res.status(201).json({
      status: 'success',
      data: {
        user: newUser,
        token
      }
    });

    const sync = req.query.sync;
    if (sync === 'true') {
      await User.sync();
      console.log('Tables synchronized');
    }


  } catch (err) {
    res.status(400).json({
      status: 'error',
      message: err.message
    });
  }
};

exports.loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(new ErrorResponse(`Please provide email and password`, 400));
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return next(new ErrorResponse(`User not found`, 401));
    }

    // Compare the provided password with the hashed password in the database
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return next(new ErrorResponse(`Invalid credentials`, 401));
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);

    res.status(200).json({
      status: 'success',
      data: {
        user,
        token
      }
    });

    // setTokenCookieAndRespond(user, 202, res)

  } catch (err) {
    res.status(400).json({
      status: 'error',
      message: err.message
    });
  }
};


exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.findAll();

    res.status(200).json({
      status: 'success',
      data: users
    });

  } catch (err) {
    res.status(400).json({
      status: 'error',
      message: err.message
    });
  }
};

exports.getUserById = async (req, res, next) => {
  try {
    // const userId = req.params.id; // Assuming the route is '/users/:id'

    // Find the user by ID
    const user = await User.findByPk(req.params.id);

    if (!user) {
      return next(new ErrorResponse(`User not found`, 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    });

  } catch (err) {
    res.status(400).json({
      status: 'error',
      message: err.message
    });
  }
};

exports.updateUser = async (req, res, next) => {
  try {
    const userId = req.params.id; // Assuming the route is '/users/:id'
    const { name, email, role } = req.body;

    // Find the user by ID
    const user = await User.findByPk(userId);

    if (!user) {
      return next(new ErrorResponse(`User not found`, 404));
    }

    // Update user properties
    user.name = name;
    user.email = email;
    user.role = role;

    // Save the updated user
    await user.save();

    res.status(200).json({
      status: 'success',
      data: user
    });

  } catch (err) {
    res.status(400).json({
      status: 'error',
      message: err.message
    });
  }
};

exports.resetPassword = async (req, res, next) => {
  try {
    const { email, newPassword } = req.body;

    if (!email || !newPassword) {
      return next(new ErrorResponse(`Please provide email and new password`, 400));
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return next(new ErrorResponse(`User not found`, 404));
    }

    // Hash the new password before updating in the database
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the user's password
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({
      status: 'success',
      message: 'Password reset successful'
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
      user
    }
  });
};








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
    const token = jwt.sign({ id: newUser.id }, `${process.env.JWT_SECRET}`);

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
    const token = jwt.sign({ id: user.id }, `${process.env.JWT_SECRET}`);

    res.status(200).json({
      status: 'success',
      data: {
        id: user.id,
        token
      }
    });

  } catch (err) {
    res.status(400).json({
      status: 'error',
      message: err.message
    });
  }
};




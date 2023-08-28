const crypto = require("crypto");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const User = require("../models/user");
const sendEmail = require("../utils/sendEmail");

exports.registerUser = asyncHandler(async (req, res, next) => {
  //destructure to pull out data from the request body
  const { name, email, password, role } = req.body;

  //Create a new user
  const user = await User.create({
     name: name,
     email: email,
     password: password,
     role: role,
  });

  sendTokenResponse(user, 200, res);
});


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

const sendTokenResponse = (user, statusCode, res) => {
  //Create token
  const token = user.getSignedJwtToken();

  const options = {
     expires: new Date(
        Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
     ),
     httpOnly: true,
  };

  if (process.env.NODE_ENV == "production") {
     options.secure = true;
  }

  res.status(statusCode).cookie("token", token, options).json({
     suceess: true,
     token: token,
     data: user,
     error: null,
  });
};
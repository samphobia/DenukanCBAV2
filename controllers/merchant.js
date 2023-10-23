const jwt = require("jsonwebtoken");
const ErrorResponse = require("../utils/errorResponse");
const bcrypt = require("bcrypt");
const Merchant = require("../models/Merchants");
const ResetToken = require("../models/ResetToken");
const { sendOTP, sendResetEmail } = require("../middleware/mailer");
const { generateOTP } = require("../middleware/otp");
const OTP = require("../models/Otp");
const {
  validateEmail,
  validatePhoneNumber,
  validatePassword,
  validateLength,
  validateRequiredFields,
} = require("../helpers/validator");

function generateMerchantId() {
  const min = 1000000000; // 10 digits
  const max = 9999999999;
  return String(Math.floor(min + Math.random() * (max - min + 1)));
}

// Function to generate a random 6-digit OTP
// function generateOTP() {
//   return String(Math.floor(100000 + Math.random() * 900000));
// }

exports.createMerchant = async (req, res, next) => {
  try {
    const requiredFields = [
      "merchantName",
      "sortCode",
      "email",
      "address",
      "colorCode",
      "phone",
      "description",
      "image",
      "password",
    ];
    const missingFieldsError = validateRequiredFields(req, res, requiredFields);

    if (missingFieldsError) {
      return missingFieldsError;
    }

    // Generate a unique 10-digit merchantId
    const merchantCoreId = generateMerchantId();

    // Generate a 6-digit OTP
    // const otp = generateOTP();

    // Extract user data from the request body
    const {
      merchantName,
      sortCode,
      address,
      colorCode,
      phone,
      description,
      email,
      image,
      password,
      instagram,
      facebook,
      twitter,
    } = req.body;

    if (!validateEmail(email)) {
      return res.status(403).json({
        message: "invalid email address",
      });
    }

    const existingMerchant = await Merchant.findOne({ where: { email } });
    if (existingMerchant) {
      return res.status(403).json({
        message: "Merchant already exist.",
      });
    }

    if (!validatePhoneNumber(phone)) {
      return res.status(403).json({
        message: "invalid phone number",
      });
    }

    if (!validateLength(merchantName, 3, 30)) {
      return res.status(400).json({
        message: "Name must between 3 and 30 characters.",
      });
    }

    if (!validatePassword(password)) {
      return res.status(403).json({
        message:
          "password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character",
      });
    }
    // Hash the password before saving to the database
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user with the generated merchantId and OTP
    const merchant = await Merchant.create({
      merchantCoreId,
      merchantName,
      sortCode,
      address,
      colorCode,
      phone,
      description,
      email,
      image,
      password: hashedPassword,
      instagram,
      facebook,
      twitter,
      isVerified: false, // Set isVerified to false initially
    });

    const token = jwt.sign({ id: merchant.id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRE,
    });

    const otp = generateOTP().toString();

    // Calculate the expiration time (5 minutes from the current time)
    const expirationTime = new Date();
    expirationTime.setMinutes(expirationTime.getMinutes() + 5);

    const savedOTP = await OTP.create({
      otp: otp,
      userId: merchant.id,
      recipientId: merchant.id, // Assuming merchant is already created
      recipientType: "merchant",
      expiresAt: expirationTime,
    });

    // Send the OTP to the user's email for verification
    const url = `${process.env.BASE_URL}/activate/${token}`;
    await sendOTP(
      merchant.email,
      merchant.merchantName,
      merchant.merchantCoreId,
      otp,
      url
    )
      .then(
        res.status(201).json({
          data: {
            otp: savedOTP.otp,
          },
          status: "00",
          // id: merchant.id,
          // code: "00",
          // message: "SUCCDESS",
          // merchantName: merchantName,
          // token: token,
          message:
            "Registration Success...Please enter your OTP is the provided section on the verification page",
        })
      )
      .catch((error) => {
        console.log(error);
      });
  } catch (err) {
    res.status(400).json({
      status: "error",
      message: "Registration failed",
    });
  }
};

exports.verifyMerchant = async (req, res, next) => {
  try {
    const { otp } = req.body;
    const merchantId = req.merchant.id;

    // Find the user by ID
    const merchant = await Merchant.findByPk(merchantId);
    console.log(merchantId);

    if (!merchant) {
      return res.status(404).json({
        message: "Merchant not found.",
      });
    }

    const storedOTP = await OTP.findOne({
      where: {
        userId: merchantId,
      },
    });

    if (!storedOTP) {
      return res.status(404).json({
        message: "OTP not found",
      });
    }

    // Check if the provided OTP matches the one generated during registration
    if (otp !== storedOTP.otp) {
      return res.status(403).json({
        message: "Invalid OTP",
      });
    }

    const currentTime = new Date();
    if (currentTime > storedOTP.expiresAt) {
      return res.status(403).json({
        message: "OTP has expired",
      });
    }

    // Mark the user as verified
    merchant.isVerified = true;
    await merchant.save();

    res.status(200).json({
      code: "00",
      message: "Success",
      data: {},
      message: "User verified successfully",
    });
  } catch (err) {
    res.status(401).json({
      status: "error",
      message: "There was an error verifying the OTP",
      // message: err.message,
    });
  }
};

exports.loginMerchant = async (req, res, next) => {
  try {
    const { merchantCoreId, password } = req.body;

    // Find the merchant by merchantCoreId
    const merchant = await Merchant.findOne({ where: { merchantCoreId } });

    if (!merchant) {
      return res.status(404).json({
        message: "Merchant not found.",
      });
    }

    // Check if the provided password matches the hashed password in the database
    const isPasswordMatch = await bcrypt.compare(password, merchant.password);

    if (!isPasswordMatch) {
      return res.status(403).json({
        message: "Invalid Password",
      });
    }

    // Generate and return an authentication token for the merchant
    const token = jwt.sign({ id: merchant.id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRE,
    });

    res.status(200).json({
      data: {
        token: token,
        merchant,
      },
      code: "00",
      message: "success",
    });
  } catch (err) {
    res.status(400).json({
      status: "error",
      message: "Login failed",
    });
  }
};

exports.sendResetToken = async (req, res, next) => {
  try {
    const { email } = req.body;

    const merchant = await Merchant.findOne({ where: { email } });

    if (!merchant) {
      return res.status(404).json({
        message: "Merchant not found.",
      });
    }

    // Generate a reset token with the merchant's ID and expiration time
    const resetToken = jwt.sign(
      { id: merchant.id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" } // Set the token expiration time
    );

    // Store the reset token in the database
    await ResetToken.create({
      email: merchant.email,
      resetToken,
      expiresAt: new Date(new Date().getTime() + 60 * 60 * 1000), // 1 hour
    });

    // Send an email to the merchant with a link containing the resetToken
    const url = `${process.env.BASE_URL}/activate/${resetToken}`;
    sendResetEmail(merchant.email, merchant.merchantName, resetToken);

    res.status(200).json({
      code: "00",
      data: {},
      status: "success",
      token: resetToken,
      message: "Reset token sent successfully",
    });
  } catch (err) {
    res.status(400).json({
      status: "error",
      message: "There was a problem sending the reset token",
    });
  }
};

exports.resetPassword = async (req, res, next) => {
  try {
    const token = req.query;
    const newPassword = req.body;

    // Verify the reset token
    const decoded = jwt.verify(token, process.env.RESET_TOKEN_SECRET);

    // Check if the reset token is still valid
    const resetToken = await ResetToken.findOne({
      where: {
        email: decoded.email,
        resetToken: token,
        expiresAt: { [Sequelize.Op.gt]: new Date() }, // Check if the token is not expired
      },
    });

    if (!resetToken) {
      return res.status(401).json({
        message: "Invalid or Expired Token",
      });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the merchant's password
    const merchant = await Merchant.findOne({
      where: { email: decoded.email },
    });
    merchant.password = hashedPassword;
    await merchant.save();

    // Remove the used reset token
    await resetToken.destroy();

    res.status(200).json({
      code: "00",
      status: "success",
      data: {},
      message: "Password reset successfully",
    });
  } catch (err) {
    res.status(400).json({
      status: "error",
      message: "token reset failed",
    });
  }
};

exports.getAllMerchant = async (req, res, next) => {
  try {
    const merchant = await Merchant.findAll();

    res.status(200).json({
      code: "00",
      status: "success",
      data: merchant,
    });
  } catch (err) {
    res.status(400).json({
      status: false,
      message: "failed to load all Mercahnts",
    });
  }
};

// exports.getUserById = async (req, res, next) => {
//   try {
//     // const userId = req.params.id; // Assuming the route is '/users/:id'

//     // Find the user by ID
//     const user = await Merchant.findByPk(req.params.id);

//     if (!user) {
//       return next(new ErrorResponse(`Merchant not found`, 404));
//     }

//     res.status(200).json({
//       status: "success",
//       user: {
//         id: user.id,
//         name: user.name,
//         email: user.email,
//       },
//     });
//   } catch (err) {
//     res.status(400).json({
//       status: false,
//       message: "failed to load user",
//     });
//   }
// };

// exports.updateUser = async (req, res, next) => {
//   try {
//     const userId = req.params.id; // Assuming the route is '/users/:id'
//     const { name, email, role } = req.body;

//     // Find the user by ID
//     const user = await Merchant.findByPk(userId);

//     if (!user) {
//       return next(new ErrorResponse(`Merchant not found`, 404));
//     }

//     // Update user properties
//     user.name = name;
//     user.email = email;
//     user.role = role;

//     // Save the updated user
//     await user.save();

//     res.status(200).json({
//       status: "success",
//       data: user,
//     });
//   } catch (err) {
//     res.status(400).json({
//       status: false,
//       message: "failed to update user",
//     });
//   }
// };

exports.updateMerchant = async (req, res, next) => {
  try {
    const merchantId = req.params.id;
    const {
      merchantName,
      sortCode,
      address,
      colorCode,
      phone,
      description,
      email,
    } = req.body;

    // Check if the merchant exists
    const merchant = await Merchant.findByPk(merchantId);

    if (!merchant) {
      return next(new ErrorResponse(`Merchant not found`, 404));
    }

    // Ensure the request is made by an authorized user (e.g., merchant or admin)
    // Replace this with your own authorization logic based on your needs

    // Update merchant properties
    merchant.merchantName = merchantName || merchant.merchantName;
    merchant.sortCode = sortCode || merchant.sortCode;
    merchant.address = address || merchant.address;
    merchant.colorCode = colorCode || merchant.colorCode;
    merchant.phone = phone || merchant.phone;
    merchant.description = description || merchant.description;
    merchant.email = email || merchant.email;

    // Save the updated merchant
    await merchant.save();

    res.status(200).json({
      statuscode: "00",
      status: "success",
      data: merchant,
      message: "Merchant updated successfully",
    });
  } catch (err) {
    res.status(400).json({
      status: "error",
      message: err.message,
    });
  }
};

// const setTokenCookieAndRespond = (user, statusCode, res) => {
//   const token = jwt.sign({ id: user.id }, `${process.env.JWT_SECRET}`);

//   res.cookie("token", token, {
//     httpOnly: true,
//     maxAge: 24 * 60 * 60 * 1000, // Set the cookie expiration time (e.g., 1 day)
//     secure: process.env.NODE_ENV === "production", // Set 'secure' to true in production
//   });

//   res.status(statusCode).json({
//     success: true,
//     message: "succes",
//     token: token,
//     user: {
//       id: user.id,
//       name: user.name,
//       email: user.email,
//       role: user.role,
//     },
//   });
// };

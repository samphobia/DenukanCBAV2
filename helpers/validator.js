const Merchant = require("../models/Merchants");

exports.validatePhoneNumber = (phoneNumber) => {
  // Define a regular expression pattern for a typical phone number
  // This pattern allows for variations in formatting, such as (555) 555-5555, 555-555-5555, or 5555555555
  const phonePattern = /^(\()?\d{3}(\))?[-.\s]?\d{3}[-.\s]?\d{4}$/;

  // Remove any non-numeric characters from the phone number string
  const numericPhoneNumber = phoneNumber.replace(/\D/g, '');

  return phonePattern.test(numericPhoneNumber);
};

exports.validateEmail = (email) => {
  return String(email)
    .toLowerCase()
    .match(/^([a-z\d\.-]+)@([a-z\d-]+)\.([a-z]{2,12})(\.[a-z]{2,12})?$/);
};

exports.validatePassword = (password) => {
  // Check the password length (at least 8 characters)
  if (password.length < 8) {
    return false;
  }

  // Check for password strength (e.g., containing at least one uppercase letter, one lowercase letter, one digit, and one special character)
  const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]+$/;

  return passwordPattern.test(password);
};

exports.validateLength = (text, min, max) => {
  if (text.length > max || text.length < min) {
    return false;
  }
  return true;
};

exports.validateRequiredFields = (req, res, requiredFields) => {
  const missingFields = [];

  for (const field of requiredFields) {
    if (!req.body[field]) {
      missingFields.push(field);
    }
  }

  if (missingFields.length > 0) {
    return res.status(400).json({
      message: `Missing required fields: ${missingFields.join(', ')}`,
    });
  }

  return null; // No missing fields
}

exports.validateAccountId = (account_id) => {
  // Check if account_id is a positive integer
  const isPositiveInteger = Number.isInteger(account_id) && account_id > 0;

  if (!isPositiveInteger) {
    throw new Error('Invalid account_id. Must be a positive integer.');
  }
}

exports.validateAmount = (amount) => {
  // Ensure the input is a number or a string that represents a number
  const parsedAmount = parseFloat(amount);
  
  // Ensure the parsed amount is a positive integer
  if (!Number.isInteger(parsedAmount) || parsedAmount <= 0) {
    return false;
  }

  return true;
};

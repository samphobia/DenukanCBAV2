const Account = require("../models/Account");// Adjust the path accordingly
const Customer = require("../models/Customer");// Adjust the path accordingly
const Sequelize = require('sequelize');

const generateAccountNumber = () => {
  const min = 1000000000; // 10-digit minimum number
  const max = 9999999999; // 10-digit maximum number
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

exports.createAccount = async (req, res) => {
  try {
    // Assuming that you receive the necessary data in the request body
    const {
      customer_id,
      accountType,
      accountDescription,
      blockView,
      balance,
      debitInterest,
      creditInterest,
      ODRate,
      accountOfficer,
    } = req.body;

    // Check if the customer_id exists in the Customer model
    const customer = await Customer.findByPk(customer_id);
    if (!customer) {
      return res.status(404).json({ error: 'Customer not found' });
    }

    const accountNumber = generateAccountNumber();

    // Create a new account
    const newAccount = await Account.create({
      customer_id,
      accountType,
      accountNumber,
      accountDescription,
      blockView,
      balance,
      debitInterest,
      creditInterest,
      ODRate,
      accountOfficer,
    });

    res.status(201).json({ message: 'Account created successfully', account: newAccount });
  } catch (error) {
    console.error('Error creating account:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

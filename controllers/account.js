const Account = require("../models/Account"); // Adjust the path accordingly
const Customer = require("../models/Customer"); // Adjust the path accordingly
const Transactions = require("../models/Transaction"); // Adjust the path accordingly
const Sequelize = require('sequelize');
const {sequelize} = require('../config/database');

const generateAccountNumber = () => {
  const min = 1000000000; // 10-digit minimum number
  const max = 9999999999; // 10-digit maximum number
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

exports.createAccount = async (req, res) => {
  try {
    const { customer_id, account_type, accoutDescription, accountType } = req.body;

    // Check if the customer exists
    const customer = await Customer.findByPk(customer_id);
    if (!customer) {
      return res.status(404).json({ error: 'Customer not found' });
    }

    // Perform the account creation within a transaction
    await sequelize.transaction(async (t) => {
      // Create the account
      const account = await Account.create(
        {
          customer_id,
          account_type,
          accoutDescription,
          accountType,
          accountNumber: generateAccountNumber()
        },
        { transaction: t }
      );

      res.status(201).json({
        message: 'Account created successfully',
        account: {
          account_id: account.account_id,
          account_number: account.account_number,
          customer_id: account.customer_id,
          account_type: account.account_type,
          balance: account.balance,
          created_at: account.created_at,
        },
      });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
},

exports.getAllAccounts = async (req, res) => {
  try {
    // Fetch all accounts with associated customer information
    const accounts = await Account.findAll({
      include: [{ model: Customer }],
    });

    // Extract relevant information for each account
    const formattedAccounts = accounts.map((account) => ({
      id: account.id,
      customerName: `${account.Customer.firstName} ${account.Customer.lastName}`,
      accountType: account.accountType,
      accountNumber: account.accountNumber,
      balance: account.balance,
      created_at: account.createdAt,
      // ... include other attributes as needed
    }));

    res.status(200).json(formattedAccounts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
  };

exports.getAccountByType = async (req, res) => {
  try {
    // Assuming that you receive the account type in the request parameters
    const { accountType } = req.params;

    // Query the database to find accounts based on the provided accountType
    const accounts = await Account.findAll({
      where: {
        accountType,
      },
    });

    if (accounts.length === 0) {
      return res.status(404).json({ message: 'No accounts found for the specified type' });
    }

    res.status(200).json({ message: 'Accounts retrieved successfully', accounts });
  } catch (error) {
    console.error('Error retrieving accounts:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.getAccountDetails = async (req, res) => {
  try {
    const { accountNumber } = req.params;

    // Find the account and its associated customer
    const accountDetails = await Account.findOne({
      where: { accountNumber },
      include: [{ model: Customer }],
    });

    if (!accountDetails) {
      return res.status(404).json({
        message: "Account not found",
      });
    }

    // Find all transactions for the account
    const transactions = await Transactions.findAll({
      where: { account_id: accountDetails.id },
      order: [['transaction_date', 'DESC']], // Optional: Order transactions by date
    });

    // Extract relevant information for each transaction
    const formattedTransactions = transactions.map((transaction) => ({
      transaction_id: transaction.transaction_id,
      account_id: transaction.account_id,
      transaction_type: transaction.transaction_type,
      amount: transaction.amount,
      transaction_date: transaction.transaction_date,
      // ... include other attributes as needed
    }));

    // Extract relevant information for the account details response
    const formattedAccountDetails = {
      account_id: accountDetails.id,
      account_number: accountDetails.accountNumber,
      customer_id: accountDetails.customer_id,
      customerName: `${accountDetails.Customer.title} ${accountDetails.Customer.firstName} ${accountDetails.Customer.lastName}`,
      account_type: accountDetails.accountType,
      balance: accountDetails.balance,
      created_at: accountDetails.createdAt,
      transactions: formattedTransactions,
      // ... include other attributes as needed
    };

    res.status(200).json(formattedAccountDetails);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


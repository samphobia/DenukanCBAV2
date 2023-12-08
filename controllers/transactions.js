const Account = require("../models/Account"); // Adjust the path accordingly
const Customer = require("../models/Customer"); // Adjust the path accordingly
const Transactions = require("../models/Transaction"); // Adjust the path accordingly
const Sequelize = require("sequelize");
const { sequelize } = require("../config/database");
const {
  validateAccountId,
  validateLength,
  validateAmount,
} = require("../helpers/validator");

exports.deposit = async (req, res, next) => {
  try {
    const { accountNumber, amount } = req.body;

    if (!validateLength(accountNumber, 10, 10)) {
      return res.status(400).json({
        message: "Invalid account number",
      });
    }

    if (!validateAmount(amount)) {
      return res.status(403).json({
        message: "Invalid amount",
      });
    }

    // Perform the deposit
    await sequelize.transaction(async (t) => {
      const account = await Account.findOne({
        where: { accountNumber },
        transaction: t,
      });

      if (!account) {
        return res.status(404).json({
          message: "Account not found",
        });
      }
      await Transactions.create(
        {
          account_id: account.id,
          transactionsType: "Deposit",
          amount,
        },
        { transaction: t }
      );

      // Update account balance
      await Account.increment("balance", {
        by: amount,
        where: { id: account.id },
        transaction: t,
      });
    });

    res.status(200).json({ message: "Deposit successful" });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};


exports.withdrawal = async (req, res) => {
  try {
    const { accountNumber, amount } = req.body;

    if (!validateLength(accountNumber, 10, 10)) {
      return res.status(400).json({
        message: "Invalid account number",
      });
    }

    if (!validateAmount(amount)) {
      return res.status(403).json({
        message: "Invalid amount",
      });
    }
    
    // Perform the withdrawal
    await sequelize.transaction(async (t) => {
      const account = await Account.findOne({
        where: { accountNumber },
        transaction: t,
      });

      if (!account) {
        return res.status(404).json({
          message: "Account not found",
        });
      }

      // Check if the account has sufficient balance for withdrawal
      if (account.balance < amount) {
        return res.status(400).json({
          message: "Insufficient funds for withdrawal",
        });
      }

      // Create a withdrawal transaction
      await Transactions.create({
        account_id: account.id,
        transactionsType: "Withdrawal",
        amount,
      }, { transaction: t });

      // Update account balance
      await Account.decrement('balance', {
        by: amount,
        where: { id: account.id },
        transaction: t,
      });
    });

    res.status(200).json({ message: 'Withdrawal successful' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.getAllTransactionsByAccountNumber = async (req, res) => {
  try {
    const { accountNumber } = req.params;

    // Find the account
    const account = await Account.findOne({
      where: { accountNumber },
    });

    if (!account) {
      return res.status(404).json({
        message: "Account not found",
      });
    }

    // Find all transactions for the account
    const transactions = await Transactions.findAll({
      where: { account_id: account.id },
      order: [['transaction_date', 'DESC']], // Optional: Order transactions by date
    });

    // Get the current balance of the account
    const currentBalance = account.balance;

    // Extract relevant information for each transaction
    const formattedTransactions = transactions.map((transaction) => ({
      transaction_id: transaction.id,
      account_id: transaction.account_id,
      transaction_type: transaction.transactionsType,
      amount: transaction.amount,
      balance: currentBalance,
      transaction_date: transaction.transaction_date,
      // ... include other attributes as needed
    }));

    res.status(200).json(formattedTransactions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.transfer = async (req, res) => {
  try {
    const { senderAccountNumber, receiverAccountNumber, amount } = req.body;

    // Validate amount
    if (!validateAmount(amount)) {
      return res.status(403).json({
        message: "Invalid amount",
      });
    }

    // Perform the transfer within a transaction
    await sequelize.transaction(async (t) => {
      // Find the sender account
      const senderAccount = await Account.findOne({
        where: { accountNumber: senderAccountNumber },
        transaction: t,
      });

      if (!senderAccount) {
        return res.status(404).json({
          message: "Sender account not found",
        });
      }

      // Check if the sender account has sufficient balance
      if (senderAccount.balance < amount) {
        return res.status(400).json({
          message: "Insufficient funds for transfer",
        });
      }

      // Find the receiver account
      const receiverAccount = await Account.findOne({
        where: { accountNumber: receiverAccountNumber },
        transaction: t,
      });

      if (!receiverAccount) {
        return res.status(404).json({
          message: "Receiver account not found",
        });
      }

      // Create a withdrawal transaction for the sender
      await Transactions.create({
        account_id: senderAccount.id,
        transactionsType: 'Transfer',
        amount: -amount, // Negative amount for withdrawal
      }, { transaction: t });

      // Create a deposit transaction for the receiver
      await Transactions.create({
        account_id: receiverAccount.id,
        transactionsType: 'Transfer',
        amount,
      }, { transaction: t });

      // Update sender's and receiver's account balances
      await Account.decrement('balance', {
        by: amount,
        where: { id: senderAccount.id },
        transaction: t,
      });

      await Account.increment('balance', {
        by: amount,
        where: { id: receiverAccount.id },
        transaction: t,
      });
    });

    res.status(200).json({ message: 'Transfer successful' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};



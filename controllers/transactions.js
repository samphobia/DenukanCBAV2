const Account = require("../models/Account"); // Adjust the path accordingly
const Customer = require("../models/Customer"); // Adjust the path accordingly
const Transactions = require("../models/Transaction"); // Adjust the path accordingly
const Sequelize = require('sequelize');
const { sequelize } = require('../config/database');
const { validateAccountId } = require("../helpers/validator");

exports.deposit = async (req, res) => {
  try {
    const { accountNumber, amount } = req.body;

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
      await Transactions.create({
        account_id: account.id,
        transactionsType: 'Deposit',
        amount,
      }, { transaction: t });

      // Update account balance
      await Account.increment('balance', {
        by: amount,
        where: { id: account.id },
        transaction: t,
      });
    });

    res.status(200).json({ message: 'Deposit successful' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
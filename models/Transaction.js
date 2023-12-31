const Sequelize = require('sequelize');

const { sequelize } = require('../config/database');
const Account = require("../models/Account"); 

const Transactions = sequelize.define('Transactions', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  account_id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: 'Accounts',
      key: 'id',
    },
  },
  transactionsType: {
    type: Sequelize.ENUM("Deposit", "Withdrawal", "Transfer"), // Assuming Transactionss are 6-digit strings, adjust as needed
    allowNull: false,
  },
  // expiresAt: {
  //   type: Sequelize.DATE,
  //   allowNull: false,
  // },
  amount: {
    type: Sequelize.DECIMAL(12, 2),
    allowNull: false,
  },
  transaction_date: {
    type: Sequelize.DATE,
    defaultValue: Sequelize.NOW,
  },
});

// Define a one-to-many relationship between Customer and Account
Account.hasMany(Transactions, {
  foreignKey: 'account_id', // This is the foreign key in the Account model
});
Transactions.belongsTo(Account, {
  foreignKey: 'account_id', // This is the foreign key in the Account model
});

// Transactions.sync({ force: true })
//   .then(() => {
//     console.log('Transactions table synced successfully');
//   })
//   .catch((error) => {
//     console.error('Error syncing Transactions table:', error);
//   });


module.exports = Transactions;
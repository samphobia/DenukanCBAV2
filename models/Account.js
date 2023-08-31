const Sequelize = require('sequelize');// Replace with your sequelize instance
const sequelize = require('../config/database');
const Customer = require('./Customer/models'); // Replace with the actual path to your Customer model


const Account = sequelize.define('Account', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  title: {
    type: Sequelize.ENUM('Mr', 'Mrs', 'Miss'),
    allowNull: false
  },
  fullName: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  otherName: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  sex: {
    type: Sequelize.ENUM('male', 'female'),
    allowNull: false
  },
  accountBranch: {
    type: Sequelize.ENUM('Headbranch', 'OtherBranch'),
    defaultValue: 'HeadBranch',
    allowNull: false
  },
  accountProduct: {
    type: Sequelize.ENUM('Current', 'Savings', 'Corporate'),
    defaultValue: 'Savings',
    allowNull: false
  },
  accountNumber: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
  },
  subBranch: {
    type: Sequelize.STRING,
  },
  accountDescription: {
    type: Sequelize.STRING,
    len: [5, 50],
  },
  blockView: {
    type: Sequelize.BOOLEAN,
    deafaultValue: false
  },
  balance: {
    type: Sequelize.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0,
  },
  debitInterest: {
    type: Sequelize.DECIMAL(5, 2),
    allowNull: false,
    defaultValue: 8,
  },
  creditInterest: {
    type: Sequelize.DECIMAL(5, 2),
    allowNull: false,
    defaultValue: 8,
  },
  ODRate: Sequelize.STRING,
  accountOfficer: Sequelize.STRING
  // ... other fields specific to the Account model
});

// Define a one-to-many relationship between Customer and Account
Customer.hasMany(Account, {
  foreignKey: 'customerId', // This is the foreign key in the Account model
  onDelete: 'CASCADE',
});
Account.belongsTo(Customer, {
  foreignKey: 'customerId', // This is the foreign key in the Account model
});

module.exports = Account;

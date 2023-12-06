const Sequelize = require('sequelize');// Replace with your sequelize instance
const sequelize = require('../config/database');
const Customer = require('../models/Customer'); // Replace with the actual path to your Customer model


const Account = sequelize.define('Account', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  customer_id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: Customer,
      key: 'id',
    },
  },
  accountType: {
    type: Sequelize.ENUM('Current', 'Savings', 'Corporate', 'Loan'),
    defaultValue: 'Savings',
    allowNull: false
  },
  accountNumber: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
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
},
{
  timestamps: true
}
);

// Define a one-to-many relationship between Customer and Account
Customer.hasMany(Account, {
  foreignKey: 'customerId', // This is the foreign key in the Account model
  onDelete: 'CASCADE',
});
Account.belongsTo(Customer);

// Account.sync({ force: true })
//   .then(() => {
//     console.log('Account table synced successfully');
//   })
//   .catch((error) => {
//     console.error('Error syncing Account table:', error);
//   });


module.exports = Account;

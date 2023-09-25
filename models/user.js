const { Sequelize } = require('sequelize');
const Merchant = require("../models/Merchant");

const sequelize = require('../config/database');

const User = sequelize.define('user', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  firstName: {
    type: Sequelize.STRING,
    allowNull: false
  },
  lastName: {
    type: Sequelize.STRING,
    allowNull: false
  },
  email: {
    type: Sequelize.STRING,
    unique: true,
    allowNull: false,
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false
  },
},
  
  {
    timestamps: true
  }
 
);

Merchant.hasMany(User, {
  foreignKey: 'merchantId', // This is the foreign key in the Account model
  onDelete: 'CASCADE',
});
User.belongsTo(Merchant);

// User.sync({ force: true })
//   .then(() => {
//     console.log('User table synced successfully');
//   })
//   .catch((error) => {
//     console.error('Error syncing User table:', error);
//   });

module.exports = User;
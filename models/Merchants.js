const Sequelize = require('sequelize');

const sequelize = require('../config/database');

const Merchant = sequelize.define('merchant', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  merchantCoreId: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true
  },
  merchantName: {
    type: Sequelize.STRING,
    allowNull: false
  },
  sortCode: {
    type: Sequelize.STRING,
    allowNull: false
  },
  address: {
    type: Sequelize.STRING,
    allowNull: false
  },
  colorCode: {
    type: Sequelize.STRING,
    allowNull: false
  },
  phone: {
    type: Sequelize.STRING,
    allowNull: false
  },
  description: {
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
  image: {
    type: Sequelize.STRING,
    allowNull: false
  },
  isVerified: {
    type: Sequelize.BOOLEAN,
    defaultAValue: false
  },
    instagram: Sequelize.STRING,
    facebook: Sequelize.STRING,
    twitter: Sequelize.STRING
},
{
  timestamps: true
}
);

// Merchant.sync({ force: true })
//   .then(() => {
//     console.log('Merchant table synced successfully');
//   })
//   .catch((error) => {
//     console.error('Error syncing User table:', error);
//   });

module.exports = Merchant;
const { Sequelize, DataTypes} = require('sequelize');

const sequelize = require('../config/database');

const Merchant = sequelize.define('merchant', {
  id: {
    type: Sequelize.STRING,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  merchantName: {
    type: Sequelize.STRING,
    allowNull: false
  },

  sortCode: {
    type: Sequelize.STRING,
    allowNull: false
  },
  countryCode: {
    type: Sequelize.STRING,
    allowNull: false
  },
  stateCode: {
    type: Sequelize.STRING,
    allowNull: false
  },
  address: {
    type: Sequelize.STRING,
    allowNull: false
  },
  contact: {
    type: Sequelize.ARRAY(DataTypes.JSON),
    allowNull: false
  },
  colorCode: {
    type: Sequelize.STRING,
    allowNull: false
  },
  image: {
    type: Sequelize.STRING,
    allowNull: false
  },

  timestamps: true,
});

module.exports = Merchant;
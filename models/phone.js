const Sequelize = require('sequelize');

const {sequelize} = require('../config/database');

const Phone = sequelize.define('Phone', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  number: {
    type: Sequelize.STRING,
    allowNull: true
  }
},
  {
    timestamps: false
  }
);

module.exports = Phone;
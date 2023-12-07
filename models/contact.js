const Sequelize = require('sequelize');

const {sequelize} = require('../config/database');

const Contact = sequelize.define('Contact', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true
  }
},
  {
    timestamps: false
  }
);

module.exports = Contact;
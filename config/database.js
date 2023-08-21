const Sequelize = require('sequelize');

const sequelize = new Sequelize('btjbiouqmlyksi6aah3r', 'ud9yhtehb58bc5mv', 'liHueEs19PpCKemi2Pog', {
  dialect: 'mysql',
  host: 'btjbiouqmlyksi6aah3r-mysql.services.clever-cloud.com'
});

module.exports = sequelize;
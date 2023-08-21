const Sequelize = require('sequelize');

const sequelize = new Sequelize(process.env.MYSQL_ADDON_DB, process.env.MYSQL_ADDON_USER, process
  .env.MYSQL_ADDON_PASSWORD, {
  dialect: 'mysql',
  host: process.env.MYSQL_HOST
});

module.exports = sequelize;
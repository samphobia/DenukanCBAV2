const Sequelize = require('sequelize');
const mysql2 = require('mysql2')

const sequelize = new Sequelize(process.env.MYSQL_ADDON_DB, process.env.MYSQL_ADDON_USER, process
  .env.MYSQL_ADDON_PASSWORD, {
  dialect: 'mysql',
  dialectModule: mysql2,
  host: process.env.MYSQL_HOST
});

module.exports = {sequelize};
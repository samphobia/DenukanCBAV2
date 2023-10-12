const { Sequelize } = require('sequelize');
const sequelize = require('../config/database'); // Adjust the path as needed

const ResetToken = sequelize.define('resetToken', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  resetToken: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  expiresAt: {
    type: Sequelize.DATE,
    allowNull: false,
  },
});

ResetToken.sync({ force: true })
  .then(() => {
    console.log('token table synced successfully');
  })
  .catch((error) => {
    console.error('Error syncing User token:', error);
  });

module.exports = ResetToken;

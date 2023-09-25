const { Sequelize } = require('sequelize');
const sequelize = require('../config/database'); // Replace with your Sequelize instance

const OTP = sequelize.define('OTP', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  userId: {
    type: Sequelize.INTEGER, // Change the data type to match your user ID type
    allowNull: false,
  },
  otp: {
    type: Sequelize.STRING, // Assuming OTPs are 6-digit strings, adjust as needed
    allowNull: false,
  },
  expiresAt: {
    type: Sequelize.DATE,
    allowNull: false,
  },
  isVerified: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: false, // Set to false initially
  },
});

// OTP.sync({ force: true })
//   .then(() => {
//     console.log('otp table synced successfully');
//   })
//   .catch((error) => {
//     console.error('Error syncing otp table:', error);
//   });


module.exports = OTP;

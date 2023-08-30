const Sequelize = require('sequelize');

const sequelize = require('../config/database');

const User = sequelize.define('user', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  role: {
    type: Sequelize.ENUM('admin', 'user'),
    allowNull: false
  },
  name: {
    type: Sequelize.STRING,
    unique: true,
    allowNull: false

  },
  email: {
    type: Sequelize.STRING,
    unique: true,
    allowNull: false,
    isEmail: true

  },
  password: {
    type: Sequelize.STRING,
    allowNull: false
  }
},
{
  timestamps: true
}
);

// User.sync({ force: true })
//   .then(() => {
//     console.log('User table synced successfully');
//   })
//   .catch((error) => {
//     console.error('Error syncing User table:', error);
//   });

module.exports = User;
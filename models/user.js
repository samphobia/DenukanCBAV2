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
    type: Sequelize.ENUM('admin', 'merchant'),
    allowNull: false
  },
  name: Sequelize.STRING,
  email: Sequelize.STRING,
  password: Sequelize.STRING
},
{
  timestamps: true
}
);

User.sync({ force: true })
  .then(() => {
    console.log('User table synced successfully');
  })
  .catch((error) => {
    console.error('Error syncing User table:', error);
  });

module.exports = User;
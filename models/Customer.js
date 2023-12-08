const Sequelize = require('sequelize');
const {sequelize} = require('../config/database');
// const Account = require("../models/Account"); 

const Customer = sequelize.define('Customer', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  title: {
    type: Sequelize.ENUM('Mr', 'Mrs', 'Miss'),
    allowNull: false
  },
  firstName: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  lastName: Sequelize.STRING,
  surname: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  nationality: {
    type: Sequelize.ENUM('nigerian', 'ghanian'),
    allowNull: false
  },
  dob: {
    type: Sequelize.STRING,
    isDate: true
  },
  education: {
    type: Sequelize.ENUM('none', 'Basic education', 'OND/undergraduate', 'HND/BSC'),
    allowNull: true
  },
  sex: {
    type: Sequelize.ENUM('male', 'female'),
    allowNull: false
  },
  stateOfOrigin: Sequelize.STRING,
  sector: {
    type: Sequelize.ENUM('Agriculture & Forestry', 'Mining & Quarry', 'Trade & Commerce', 'Information Technology'),
    allowNull: true
  },
  residentState: Sequelize.STRING,
  residentCity: Sequelize.STRING,
  residentAddress: Sequelize.STRING,
  officeAddress: Sequelize.STRING,
  officePhone: Sequelize.STRING,
  homePhone: Sequelize.STRING,
  mobilePhone: {
    type: Sequelize.STRING,
    allowNull: false
  },
  mobilePhone2: Sequelize.STRING,
  nextOfKinPhone: Sequelize.STRING,
  nextOfKinAddress: Sequelize.STRING,
  nextOfKinEmail: {
    type: Sequelize.STRING,
    isEmail: true
  },
  nameOfNOK: Sequelize.STRING,
  meansOfID: {
    type: Sequelize.ENUM('Driving Licence', 'International Passport', 'National IDCard', 'Voters Card'),
    allowNull: true
  },
  IDNo: Sequelize.STRING,
  IDIssueDate: Sequelize.STRING,
  IDExpiryDate: Sequelize.STRING,
  referrerName: Sequelize.STRING,
  referrerPhone: Sequelize.STRING,
  isCustomerGroup: {
    type: Sequelize.BOOLEAN,
    deafaultValue: false
  },
  isCustomersignatory: {
    type: Sequelize.BOOLEAN,
    deafaultValue: false
  },
  introducer: Sequelize.STRING,
  introducerId: Sequelize.STRING,
  BVN: {
    type: Sequelize.STRING,
    len: [11],
    allowNull: false
  },
  businessCategory: {
    type: Sequelize.ENUM('small', 'medium', 'large'),
    allowNull: true
  },
  isCustomerRelated: {
    type: Sequelize.BOOLEAN,
    deafaultValue: false
  },
},
{
  timestamps: true
}
);

// Customer.hasMany(Account, {
//   foreignZKey: 'customer_id',// This is the foreign key in the Account model
//   onUpdate: 'CASCADE',
// });
// Account.belongsTo(Customer, {
//   foreignKey: 'customer_id'
// });

// Customer.sync({ force: true })
//   .then(() => {
//     console.log('customer table synced successfully');
//   })
//   .catch((error) => {
//     console.error('Error syncing customer table:', error);
//   });

module.exports = Customer;
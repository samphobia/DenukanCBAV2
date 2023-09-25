const Sequelize = require("sequelize");

const sequelize = require("../config/database");

const Corporate = sequelize.define(
  "corporate",
  {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    companyName: {
      type: Sequelize.STRING,
      unique: true,
      allowNull: false,
    },
    companyRegNo: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    dateOfReg: {
      type: Sequelize.STRING,
    },
    countryOfIncorp: {
      type: Sequelize.ENUM("nigerian", "ghanian")
    },
    companyTown: {
      type: Sequelize.STRING,
      unique: true,
      allowNull: false,
    },
    companyAddress: {
      type: Sequelize.STRING,
      unique: true,
      allowNull: false,
    },
    officePhone1: Sequelize.STRING,
    officePhone2: Sequelize.STRING,
    officePhone3: Sequelize.STRING,
    officePhone4: Sequelize.STRING,
    email: {
      type: Sequelize.STRING,
      unique: true,
      allowNull: false,
      isEmail: true,
    },
    BVN: {
      type: Sequelize.STRING,
      len: [11],
      allowNull: false,
    },
    accountOfficer: Sequelize.STRING,
    contactPerson: Sequelize.STRING,
    stateOfIncorp: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    companySector: {
      type: Sequelize.ENUM(
        "Agriculture & Forestry",
        "Mining & Quarry",
        "Trade & Commerce",
        "Information Technology"
      ),
      allowNull: true,
    },
    introducer: {
      type: Sequelize.ENUM("Staff", "Customer", "other"),
      allowNull: true,
    },
    businessCategory: {
      type: Sequelize.ENUM("Small", "medium", "Large"),
      allowNull: true,
    },
    introducerId: Sequelize.STRING,
    isCorporateGroup: {
      type: Sequelize.BOOLEAN,
      deafaultValue: false
    },
    requiresEmailAlert: {
      type: Sequelize.BOOLEAN,
      deafaultValue: false
    },
    requiresSMSAlert: {
      type: Sequelize.BOOLEAN,
      deafaultValue: false
    },
  },
  {
    timestamps: true,
  }
);

// Corporate.sync({ force: true })
//   .then(() => {
//     console.log('User table synced successfully');
//   })
//   .catch((error) => {
//     console.error('Error syncing Corporate table:', error);
//   });

module.exports = Corporate;

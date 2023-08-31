const Customer = require('../models/Customer');

exports.createCustomer = async (req, res, next) => {
  try {
    const {
      title,
      firstName,
      lastName,
      surname,
      nationality,
      dob,
      education,
      sex,
      stateOfOrigin,
      sector,
      residentState,
      residentCity,
      residentAddress,
      officeAddress,
      officePhone,
      homePhone,
      mobilePhone,
      mobilePhone2,
      nextOfKinPhone,
      nextOfKinAddress,
      nextOfKinEmail,
      nameOfNOK,
      meansOfID,
      IDNo,
      IDIssueDate,
      IDExpiryDate,
      referrerName,
      referrerPhone,
      isCustomerGroup,
      isCustomersignatory,
      introducer,
      introducerId,
      BVN,
      businessCategory,
      isCustomerRelated
    } = req.body;

    const newCustomer = await Customer.create({
      title,
      firstName,
      lastName,
      surname,
      nationality,
      dob,
      education,
      sex,
      stateOfOrigin,
      sector,
      residentState,
      residentCity,
      residentAddress,
      officeAddress,
      officePhone,
      homePhone,
      mobilePhone,
      mobilePhone2,
      nextOfKinPhone,
      nextOfKinAddress,
      nextOfKinEmail,
      nameOfNOK,
      meansOfID,
      IDNo,
      IDIssueDate,
      IDExpiryDate,
      referrerName,
      referrerPhone,
      isCustomerGroup,
      isCustomersignatory,
      introducer,
      introducerId,
      BVN,
      businessCategory,
      isCustomerRelated
    });

    res.status(201).json({
      status: 'success',
      data: {
        customer: newCustomer
      }
    });
  } catch (err) {
    res.status(400).json({
      status: 'error',
      message: err.message
    });
  }
};

exports.getAllCustomers = async (req, res, next) => {
  try {
    const customer = await Customer.findAll();

    res.status(200).json({
      status: 'success',
      data: customer
    });

  } catch (err) {
    res.status(400).json({
      status: 'error',
      message: err.message
    });
  }
};


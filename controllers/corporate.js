const Corporate = require("../models/Corporate");
const ErrorResponse = require("../utils/errorResponse");

exports.createCorporate = async (req, res) => {
  try {
    const {
      companyName,
      companyRegNo,
      dateOfReg,
      countryOfIncorp,
      companyTown,
      companyAddress,
      officePhone1,
      officePhone2,
      officePhone3,
      officePhone4,
      email,
      BVN,
      accountOfficer,
      contactPerson,
      stateOfIncorp,
      companySector,
      introducer,
      businessCategory,
      introducerId,
      isCorporateGroup,
      requiresEmailAlert,
      requiresSMSAlert,
    } = req.body;

    // Check if a corporate with the same email or BVN already exists
    const existingCorporate = await Corporate.findOne({
      where:  [{ email }, { BVN }]
    });

    if (existingCorporate) {
      return next(new ErrorResponse(`Corporation with this email and BVN already exists`, 400))
    }

    // Create the corporate
    const newCorporate = await Corporate.create({
      companyName,
      companyRegNo,
      dateOfReg,
      countryOfIncorp,
      companyTown,
      companyAddress,
      officePhone1,
      officePhone2,
      officePhone3,
      officePhone4,
      email,
      BVN,
      accountOfficer,
      contactPerson,
      stateOfIncorp,
      companySector,
      introducer,
      businessCategory,
      introducerId,
      isCorporateGroup,
      requiresEmailAlert,
      requiresSMSAlert,
    });

    return res.status(201).json({
      status: true,
      message: "Corporate created successfully",
      corporate: newCorporate,
    });
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getAllCorporate = async (req, res, next) => {
  try {
    const corporate = await Corporate.findAll();

    res.status(200).json({
      status: true,
      message: 'Corporate customers loaded successfully',
      data: corporate
    });

  } catch (err) {
    res.status(400).json({
      status: 'error',
      message: err.message
    });
  }
};

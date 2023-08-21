const { v4: uuidv4 } = require('uuid');
const Merchant = require('../models/merchant');
const Contact = require('../models/contact');
const Phone = require('../models/phone');

// Create a new Merchant with a UUID based on the first three characters of the name
exports.createMerchant = async (req, res) => {
  const { merchantName, sortCode, countryCode, stateCode, address, colorCode, image } = req.body;

  // Generate a UUID based on the first three characters of the Merchant name
  const uuid = uuidv4({
    namespace: uuidv4.DNS,
    name: merchantName.substring(0, 3).toUpperCase()
  });

  const contact = req.body.contact || [];
  const phones = contact.map(c => c.phone);

  // Create a new Merchant with the generated UUID
  try {
    const merchant = await Merchant.create({
      id: uuid,
      merchantName,
      sortCode,
      countryCode,
      stateCode,
      address,
      contact: phones,
      colorCode,
      image
    });

    // const phones = req.body.phones || [];
    // const contacts = phones.map((phone) => ({ phone }));

   

    // await merchant.setContacts(contact);

    res.status(201).json({ 
      code: '00',
      message: 'Merchant created successfully',
      data: {
        merchantid : merchant.id
      },
      errors: null
     });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

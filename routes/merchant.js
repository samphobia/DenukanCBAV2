const express = require('express')

const { createMerchant } = require('../controllers/merchant')
const { protectRoute, authorizeRole } = require("../middleware/auth");

const router = express.Router({ mergeParams: true });

router.post("/", createMerchant);

module.exports = router;
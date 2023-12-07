const express = require("express");
const { deposit } = require('../controllers/transactions')

const router = express.Router()

router.post("/deposit", deposit);


module.exports = router;
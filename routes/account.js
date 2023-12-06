const express = require("express");
const { createAccount} = require('../controllers/account')

const router = express.Router()

router.post("/createaccount", createAccount);

module.exports = router;
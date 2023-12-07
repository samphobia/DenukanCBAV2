const express = require("express");
const { createAccount, getAllAccounts} = require('../controllers/account')

const router = express.Router()

router.post("/createaccount", createAccount);

router.post("/getallaccounts", getAllAccounts);

module.exports = router;
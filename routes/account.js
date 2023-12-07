const express = require("express");
const { createAccount, getAllAccounts, getAccountByType} = require('../controllers/account')

const router = express.Router()

router.post("/createaccount", createAccount);

router.post("/getallaccounts", getAllAccounts);

router.get('/account/:accountType', getAccountByType);

module.exports = router;
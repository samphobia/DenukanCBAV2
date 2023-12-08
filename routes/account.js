const express = require("express");
const {
  createAccount,
  getAllAccounts,
  getAccountByType,
  getAccountDetails,
} = require("../controllers/account");

const router = express.Router();

router.post("/createaccount", createAccount);

router.post("/getallaccounts", getAllAccounts);

router.get("/account/:accountType", getAccountByType);

router.get("/accountDetails/:accountNumber", getAccountDetails);

module.exports = router;

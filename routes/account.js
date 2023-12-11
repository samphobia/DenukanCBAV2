const express = require("express");
const {
  createAccount,
  getAllAccounts,
  getAccountByType,
  getAccountDetails,
} = require("../controllers/account");
const { authenticateUser } = require("../middleware/auth");

const router = express.Router();

router.post("/createaccount", authenticateUser,  createAccount);

router.post("/getallaccounts", authenticateUser, getAllAccounts);

router.get("/account/:accountType", authenticateUser, getAccountByType);

router.get("/accountDetails/:accountNumber", authenticateUser, getAccountDetails);

module.exports = router;

const express = require("express");
const {
  deposit,
  withdrawal,
  getAllTransactionsByAccountNumber,
  transfer,
} = require("../controllers/transactions");
const { authenticateUser } = require("../middleware/auth");

const router = express.Router();

router.post("/deposit", authenticateUser, deposit);

router.post("/withdrawal", authenticateUser, withdrawal);

router.post("/transfer", authenticateUser, transfer);

router.get(
  "/gettransbynumber/:accountNumber",
  authenticateUser,
  getAllTransactionsByAccountNumber
);

module.exports = router;

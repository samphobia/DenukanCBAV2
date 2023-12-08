const express = require("express");
const {
  deposit,
  withdrawal,
  getAllTransactionsByAccountNumber,
  transfer,
} = require("../controllers/transactions");

const router = express.Router();

router.post("/deposit", deposit);

router.post("/withdrawal", withdrawal);

router.post("/transfer", transfer);

router.get(
  "/gettransbynumber/:accountNumber",
  getAllTransactionsByAccountNumber
);

module.exports = router;

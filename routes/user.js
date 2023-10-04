const express = require("express");

const { createUser, userLogin } = require("../controllers/user");
const { authorizeRoute } = require("../middleware/auth");

const router = express.Router({ mergeParams: true });

router.post("/", authorizeRoute, createUser);

router.post("/login", userLogin)

module.exports = router;

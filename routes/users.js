const express = require('express')

const { createUser, loginUser} = require('../controllers/users')

const router = express.Router({ mergeParams: true });

router.post("/", createUser);
router.post("/login", loginUser);

module.exports = router;
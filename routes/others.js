const express = require('express');
const {exportToPDF}  = require('../controllers/others');

const router = express.Router();

router.get('/export-to-pdf', exportToPDF);

module.exports = router;

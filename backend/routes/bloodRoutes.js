const express = require('express');
const router = express.Router();
const { getBloodStock } = require('../controllers/bloodController');

router.get('/', getBloodStock);

module.exports = router;

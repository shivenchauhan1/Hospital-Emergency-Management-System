const express = require('express');
const router = express.Router();
const { getBeds } = require('../controllers/bedController');

router.get('/', getBeds);

module.exports = router;

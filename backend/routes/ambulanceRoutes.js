const express = require('express');
const router = express.Router();
const { getAmbulances, dispatchNearestAmbulance } = require('../controllers/ambulanceController');

router.get('/', getAmbulances);
router.post('/dispatch', dispatchNearestAmbulance);

module.exports = router;

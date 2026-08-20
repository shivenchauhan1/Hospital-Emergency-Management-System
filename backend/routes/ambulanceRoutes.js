const express = require('express');
const router = express.Router();
const { getAmbulances, dispatchNearestAmbulance, resetAmbulances } = require('../controllers/ambulanceController');

router.get('/', getAmbulances);
router.post('/dispatch', dispatchNearestAmbulance);
router.post('/reset', resetAmbulances); // Reset all dispatched ambulances to Available

module.exports = router;


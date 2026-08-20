const express = require('express');
const router = express.Router();
const { getBloodStock, getCompatibleStock, requestBlood } = require('../controllers/bloodController');

router.get('/', getBloodStock);
router.get('/compatible/:group', getCompatibleStock); // Union-Find Compatible Groups Endpoint
router.post('/request', requestBlood);

module.exports = router;

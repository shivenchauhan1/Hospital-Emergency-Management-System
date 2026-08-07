const express = require('express');
const router = express.Router();
const { getPatients, registerPatient, createPatient, updatePatient, deletePatient } = require('../controllers/patientController');

router.get('/', getPatients);
router.post('/register', registerPatient);
router.post('/', createPatient);
router.put('/:id', updatePatient);
router.delete('/:id', deletePatient);

module.exports = router;

const express = require('express');
const patientController = require('../controllers/patientController');

module.exports = (io) => {
  const router = express.Router();
  const ctrl = patientController(io);

  router.get('/', ctrl.getPatients);
  router.post('/register', ctrl.registerPatient);
  router.post('/', ctrl.createPatient);
  router.put('/:id', ctrl.updatePatient);
  router.delete('/:id', ctrl.deletePatient);

  return router;
};

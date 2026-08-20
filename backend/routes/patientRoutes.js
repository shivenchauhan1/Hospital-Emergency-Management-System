const express = require('express');
const patientController = require('../controllers/patientController');

module.exports = (io) => {
  const router = express.Router();
  const ctrl = patientController(io);

  router.get('/', ctrl.getPatients);
  router.get('/reports/:patientId', ctrl.getPatientReports); // LRU Cache Report Endpoint
  router.get('/report/single/:reportId', ctrl.getSingleReport); // LRU Cache Single Report Endpoint
  router.post('/register', ctrl.registerPatient);
  router.post('/', ctrl.createPatient);
  router.put('/:id', ctrl.updatePatient);
  router.delete('/:id', ctrl.deletePatient);

  return router;
};

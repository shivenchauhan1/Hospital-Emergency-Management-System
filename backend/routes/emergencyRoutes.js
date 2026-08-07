const express = require('express');
const emergencyController = require('../controllers/emergencyController');

module.exports = (io) => {
  const router = express.Router();
  const ctrl = emergencyController(io);

  router.get('/', ctrl.getEmergencies);
  router.post('/', ctrl.createEmergency);
  router.put('/approve', ctrl.approveEmergency);
  router.put('/reject', ctrl.rejectEmergency);
  router.put('/assignDoctor', ctrl.assignDoctor);
  router.put('/dispatchAmbulance', ctrl.dispatchAmbulance);
  router.put('/allocateBed', ctrl.allocateBed);
  router.put('/requestBlood', ctrl.requestBlood);
  router.put('/complete', ctrl.completeEmergency);

  return router;
};

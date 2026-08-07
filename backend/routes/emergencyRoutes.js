const express = require('express');

const createEmergencyRoutes = (io) => {
  const router = express.Router();
  const { 
    createEmergencyRequest, 
    getEmergencyRequests, 
    updateEmergencyStatus, 
    assignDoctor, 
    dispatchAmbulance 
  } = require('../controllers/emergencyController');

  // Patient Submits Emergency (POST /api/emergency)
  router.post('/', (req, res) => createEmergencyRequest(req, res, io));

  // Staff Fetches Queue (GET /api/emergency)
  router.get('/', getEmergencyRequests);

  // Staff Updates Status (PUT /api/emergency/:id)
  router.put('/:id', (req, res) => updateEmergencyStatus(req, res, io));

  // Staff Assigns Doctor (PUT /api/assignDoctor)
  router.put('/assignDoctor', (req, res) => assignDoctor(req, res, io));

  // Staff Dispatches Ambulance (PUT /api/dispatchAmbulance)
  router.put('/dispatchAmbulance', (req, res) => dispatchAmbulance(req, res, io));

  return router;
};

module.exports = createEmergencyRoutes;

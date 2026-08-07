const express = require('express');
const appointmentController = require('../controllers/appointmentController');

module.exports = (io) => {
  const router = express.Router();
  const ctrl = appointmentController(io);

  router.get('/', ctrl.getAppointments);
  router.post('/', ctrl.createAppointment);
  router.put('/approve', ctrl.approveAppointment);
  router.put('/reject', ctrl.rejectAppointment);
  router.put('/assignDoctor', ctrl.assignDoctor);
  router.put('/complete', ctrl.completeAppointment);

  return router;
};

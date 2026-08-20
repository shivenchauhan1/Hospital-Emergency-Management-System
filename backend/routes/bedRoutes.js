const express = require('express');
const bedController = require('../controllers/bedController');

module.exports = (io) => {
  const router = express.Router();
  const ctrl = bedController(io);

  router.get('/', ctrl.getBeds);
  router.post('/allocate', ctrl.allocateBed);
  router.post('/release', ctrl.releaseBed);

  return router;
};

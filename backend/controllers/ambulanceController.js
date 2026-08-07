const Ambulance = require('../models/Ambulance');

exports.getAmbulances = async (req, res) => {
  try {
    const ambulances = await Ambulance.find();
    res.json({ success: true, count: ambulances.length, data: ambulances });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

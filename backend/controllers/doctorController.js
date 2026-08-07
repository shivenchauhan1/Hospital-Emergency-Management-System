const Doctor = require('../models/Doctor');

exports.getDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find().sort({ createdAt: -1 });
    res.json({ success: true, count: doctors.length, data: doctors });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const Bed = require('../models/Bed');

exports.getBeds = async (req, res) => {
  try {
    const beds = await Bed.find();
    res.json({ success: true, count: beds.length, data: beds });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

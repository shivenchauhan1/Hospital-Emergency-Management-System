const BloodInventory = require('../models/BloodInventory');

exports.getBloodStock = async (req, res) => {
  try {
    const blood = await BloodInventory.find();
    res.json({ success: true, count: blood.length, data: blood });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

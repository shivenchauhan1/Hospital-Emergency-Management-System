const mongoose = require('mongoose');

const bloodInventorySchema = new mongoose.Schema({
  group: { type: String, required: true, unique: true },
  units: { type: Number, required: true, default: 20 },
  status: { type: String, default: 'Adequate' }
}, { timestamps: true });

module.exports = mongoose.model('BloodInventory', bloodInventorySchema);

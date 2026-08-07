const mongoose = require('mongoose');

const bedSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  bedNumber: { type: String, required: true },
  type: { type: String, default: 'General', enum: ['ICU', 'General', 'Emergency', 'Operation Theatre', 'Recovery'] },
  status: { type: String, default: 'Available', enum: ['Available', 'Occupied', 'Cleaning', 'Reserved'] }
}, { timestamps: true });

module.exports = mongoose.model('Bed', bedSchema);

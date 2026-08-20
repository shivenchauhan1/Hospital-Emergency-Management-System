const mongoose = require('mongoose');

const ambulanceSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  number: { type: String, required: true },
  driver: { type: String, required: true },
  phone: { type: String, default: '+91 98765 00000' },
  location: { type: String, default: 'Sector 32 Hospital Bay' },
  zone: { type: String, default: 'Sector 32' }, // Graph Node Zone
  eta: { type: String, default: '5 Mins' },
  status: { type: String, default: 'Available', enum: ['Available', 'Dispatched', 'On Route', 'Maintenance'] }
}, { timestamps: true });

module.exports = mongoose.model('Ambulance', ambulanceSchema);

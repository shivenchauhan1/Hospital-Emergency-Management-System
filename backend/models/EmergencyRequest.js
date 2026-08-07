const mongoose = require('mongoose');

const emergencyRequestSchema = new mongoose.Schema({
  requestId: { type: String, required: true, unique: true },
  patient: { type: String, required: true },
  phone: { type: String, required: true },
  emergencyType: { type: String, required: true },
  priority: { type: String, enum: ['Critical', 'High', 'Medium'], default: 'Critical' },
  status: { type: String, enum: ['Pending', 'Approved', 'Rejected', 'Doctor Assigned', 'Ambulance Dispatched', 'In Resuscitation', 'Discharged'], default: 'Pending' },
  doctor: { type: String, default: null },
  ambulance: { type: String, default: null },
  address: { type: String, required: true },
  description: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('EmergencyRequest', emergencyRequestSchema);

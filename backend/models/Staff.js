const mongoose = require('mongoose');

const staffSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  role: { 
    type: String, 
    required: true, 
    enum: ['Admin', 'Doctor', 'Receptionist', 'Emergency Coordinator', 'Blood Bank Officer', 'Ambulance Control'] 
  },
  department: { type: String, default: 'General Administration' },
  phone: { type: String, default: '+91 98765 00000' },
  email: { type: String, required: true },
  status: { type: String, default: 'Active', enum: ['Active', 'On Leave', 'Offline'] }
}, { timestamps: true });

module.exports = mongoose.model('Staff', staffSchema);

const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  department: { type: String, required: true },
  specialization: { type: String, default: 'General Medicine' },
  availability: { type: String, default: 'Available' },
  experience: { type: String, default: '10+ Years' },
  phone: { type: String, default: '+91 172 456 7890' },
  todayAppointments: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Doctor', doctorSchema);

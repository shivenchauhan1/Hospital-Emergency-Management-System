const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  patientName: { type: String, required: true },
  doctorName: { type: String, required: true },
  department: { type: String, required: true },
  date: { type: String, required: true },
  timeSlot: { type: String, required: true },
  status: { type: String, default: 'Appointment Requested', enum: ['Appointment Requested', 'Scheduled', 'Approved', 'Doctor Assigned', 'Completed', 'Cancelled'] }
}, { timestamps: true });

module.exports = mongoose.model('Appointment', appointmentSchema);

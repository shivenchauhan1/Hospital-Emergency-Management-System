const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  age: { type: Number, required: true },
  gender: { type: String, default: 'Male' },
  phone: { type: String, required: true },
  address: { type: String, default: 'Sector 32, Chandigarh' },
  bloodGroup: { type: String, default: 'O+' },
  status: { type: String, default: 'Registered', enum: ['Registered', 'Registered (OPD)', 'Admitted', 'Discharged', 'Outpatient', 'Critical'] },
  ward: { type: String, default: 'General Ward' },
  bedNumber: { type: String, default: 'Bed-GEN-01' },
  attendingDoctor: { type: String, default: 'Dr. Rajesh Sharma' },
  medicalHistory: { type: String, default: 'No known severe drug allergies' },
  admittedAt: { type: String, default: () => new Date().toLocaleDateString() }
}, { timestamps: true });

module.exports = mongoose.model('Patient', patientSchema);

const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  reportId: { type: String, required: true, unique: true },
  patientId: { type: String, required: true },
  patientName: { type: String, required: true },
  reportType: { type: String, enum: ['PDF Clinical Audit', 'X-Ray Scan', 'MRI Brain Scan', 'CT Scan Abdomen', 'Blood Test Lab Report'], required: true },
  doctor: { type: String, required: true },
  fileUrl: { type: String, required: true },
  date: { type: String, default: () => new Date().toISOString().split('T')[0] }
});

module.exports = mongoose.model('Report', reportSchema);

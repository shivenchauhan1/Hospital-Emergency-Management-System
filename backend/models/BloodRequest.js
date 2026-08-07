const mongoose = require('mongoose');

const bloodRequestSchema = new mongoose.Schema({
  requestId: { type: String, required: true, unique: true },
  patientName: { type: String, required: true },
  bloodGroup: { type: String, required: true },
  units: { type: Number, required: true },
  hospital: { type: String, default: "Sanjeevani Multispeciality Hospital" },
  doctor: { type: String, default: "Dr. Rajesh Sharma" },
  status: { type: String, enum: ['Pending', 'Approved', 'Rejected', 'Blood Dispatched'], default: 'Pending' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('BloodRequest', bloodRequestSchema);

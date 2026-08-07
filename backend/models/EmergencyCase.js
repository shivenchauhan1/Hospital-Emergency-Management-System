const mongoose = require('mongoose');

const emergencyCaseSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  patientName: { type: String, required: true },
  age: { type: String, default: '30' },
  gender: { type: String, default: 'Male' },
  phone: { type: String, required: true },
  emergencyType: { type: String, required: true },
  priority: { type: String, default: 'Critical', enum: ['Critical', 'High', 'Medium', 'Stable'] },
  status: { 
    type: String, 
    default: 'Pending', 
    enum: ['Pending', 'Approved', 'Rejected', 'Doctor Assigned', 'Ambulance Dispatched', 'Hospital Arrival', 'Treatment Started', 'Completed'] 
  },
  assignedDoctor: { type: String, default: 'Unassigned' },
  ambulanceDispatched: { type: String, default: 'None' },
  bedAllocated: { type: String, default: 'Unallocated' },
  bloodRequested: { type: String, default: 'None' },
  address: { type: String, required: true },
  description: { type: String, default: '' },
  createdAtTime: { type: String, default: () => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
}, { timestamps: true });

module.exports = mongoose.model('EmergencyCase', emergencyCaseSchema);

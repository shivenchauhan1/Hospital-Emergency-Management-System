const mongoose = require('mongoose');

const departmentSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  head: { type: String, required: true },
  staffCount: { type: Number, default: 15 },
  status: { type: String, default: 'Operational' }
}, { timestamps: true });

module.exports = mongoose.model('Department', departmentSchema);

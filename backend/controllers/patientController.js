const Patient = require('../models/Patient');

exports.getPatients = async (req, res) => {
  try {
    const patients = await Patient.find().sort({ createdAt: -1 });
    res.json({ success: true, count: patients.length, data: patients });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.createPatient = async (req, res) => {
  try {
    const count = await Patient.countDocuments();
    const patientId = `SAN-2026-${String(count + 1001)}`;
    const newPatient = await Patient.create({
      id: patientId,
      name: req.body.name || 'New Patient',
      age: req.body.age || 30,
      gender: req.body.gender || 'Male',
      phone: req.body.phone || '+91 98765 00000',
      address: req.body.address || 'Sector 32, Chandigarh',
      bloodGroup: req.body.bloodGroup || 'O+',
      status: req.body.status || 'Admitted',
      ward: req.body.ward || 'General Ward',
      bedNumber: req.body.bedNumber || 'Bed-GEN-01',
      attendingDoctor: req.body.attendingDoctor || 'Dr. Rajesh Sharma'
    });
    res.status(201).json({ success: true, message: 'Patient Created', data: newPatient });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.updatePatient = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await Patient.findOneAndUpdate({ id }, req.body, { new: true });
    res.json({ success: true, message: 'Patient Updated', data: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.deletePatient = async (req, res) => {
  try {
    const { id } = req.params;
    await Patient.findOneAndDelete({ id });
    res.json({ success: true, message: 'Patient Deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

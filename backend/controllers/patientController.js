const Patient = require('../models/Patient');

module.exports = (io) => {
  return {
    getPatients: async (req, res) => {
      try {
        const patients = await Patient.find().sort({ createdAt: -1 });
        res.json({ success: true, count: patients.length, data: patients });
      } catch (err) {
        res.status(500).json({ success: false, message: err.message });
      }
    },

    registerPatient: async (req, res) => {
      try {
        const count = await Patient.countDocuments();
        const patientId = `PAT2026${String(count + 1).padStart(5, '0')}`;
        const newPatient = await Patient.create({
          id: patientId,
          name: req.body.name || 'Anonymous Patient',
          age: req.body.age || 30,
          gender: req.body.gender || 'Male',
          phone: req.body.phone || '+91 98765 00000',
          address: req.body.address || 'Sector 32, Chandigarh',
          bloodGroup: req.body.bloodGroup || 'O+',
          status: 'Registered (OPD)',
          ward: req.body.department || 'General OPD Care',
          attendingDoctor: req.body.doctorPreference || 'Dr. Rajesh Sharma'
        });

        if (io) {
          io.emit('new_patient', newPatient);
        }

        res.status(201).json({ 
          success: true, 
          message: 'Normal Patient Registration Successful', 
          patientId: patientId, 
          data: newPatient 
        });
      } catch (err) {
        res.status(500).json({ success: false, message: err.message });
      }
    },

    createPatient: async (req, res) => {
      try {
        const count = await Patient.countDocuments();
        const patientId = `PAT2026${String(count + 1).padStart(5, '0')}`;
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

        if (io) {
          io.emit('new_patient', newPatient);
        }

        res.status(201).json({ success: true, message: 'Patient Created', data: newPatient });
      } catch (err) {
        res.status(500).json({ success: false, message: err.message });
      }
    },

    updatePatient: async (req, res) => {
      try {
        const { id } = req.params;
        const updated = await Patient.findOneAndUpdate({ id }, req.body, { new: true });
        if (io) {
          io.emit('patient_updated', updated);
        }
        res.json({ success: true, message: 'Patient Updated', data: updated });
      } catch (err) {
        res.status(500).json({ success: false, message: err.message });
      }
    },

    deletePatient: async (req, res) => {
      try {
        const { id } = req.params;
        await Patient.findOneAndDelete({ id });
        if (io) {
          io.emit('patient_deleted', { id });
        }
        res.json({ success: true, message: 'Patient Deleted' });
      } catch (err) {
        res.status(500).json({ success: false, message: err.message });
      }
    }
  };
};

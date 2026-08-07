const EmergencyCase = require('../models/EmergencyCase');

module.exports = (io) => {
  return {
    // GET /api/emergency
    getEmergencies: async (req, res) => {
      try {
        const cases = await EmergencyCase.find().sort({ createdAt: -1 });
        res.json({ success: true, count: cases.length, data: cases });
      } catch (err) {
        res.status(500).json({ success: false, message: err.message });
      }
    },

    // POST /api/emergency
    createEmergency: async (req, res) => {
      try {
        const count = await EmergencyCase.countDocuments();
        const emergencyId = `ER2026${String(count + 1).padStart(4, '0')}`;
        
        const newCase = await EmergencyCase.create({
          id: emergencyId,
          patientName: req.body.patientName || 'Anonymous Patient',
          age: req.body.age || '30',
          gender: req.body.gender || 'Male',
          phone: req.body.phone || '+91 98765 00000',
          emergencyType: req.body.emergencyType || 'General Emergency',
          priority: req.body.priority || 'Critical',
          status: 'Pending',
          assignedDoctor: 'Unassigned',
          ambulanceDispatched: 'None',
          address: req.body.address || 'Sector 32, Chandigarh',
          description: req.body.description || ''
        });

        // Broadcast to all connected Staff Portal instances
        if (io) {
          io.emit('new_emergency_request', newCase);
        }

        res.status(201).json({
          success: true,
          message: 'Emergency request submitted and broadcasted via Socket.IO',
          data: newCase
        });
      } catch (err) {
        res.status(500).json({ success: false, message: err.message });
      }
    },

    // PUT /api/emergency/approve
    approveEmergency: async (req, res) => {
      try {
        const { id } = req.body;
        const updatedCase = await EmergencyCase.findOneAndUpdate(
          { id },
          { status: 'Approved' },
          { new: true }
        );

        if (io) {
          io.emit('case_updated', updatedCase);
        }

        res.json({ success: true, message: 'Case Approved', data: updatedCase });
      } catch (err) {
        res.status(500).json({ success: false, message: err.message });
      }
    },

    // PUT /api/emergency/reject
    rejectEmergency: async (req, res) => {
      try {
        const { id } = req.body;
        const updatedCase = await EmergencyCase.findOneAndUpdate(
          { id },
          { status: 'Rejected' },
          { new: true }
        );

        if (io) {
          io.emit('case_updated', updatedCase);
        }

        res.json({ success: true, message: 'Case Rejected', data: updatedCase });
      } catch (err) {
        res.status(500).json({ success: false, message: err.message });
      }
    },

    // PUT /api/emergency/assignDoctor
    assignDoctor: async (req, res) => {
      try {
        const { id, doctorName } = req.body;
        const updatedCase = await EmergencyCase.findOneAndUpdate(
          { id },
          { assignedDoctor: doctorName || 'Dr. Rajesh Sharma', status: 'Doctor Assigned' },
          { new: true }
        );

        if (io) {
          io.emit('doctor_assigned', updatedCase);
          io.emit('case_updated', updatedCase);
        }

        res.json({ success: true, message: 'Doctor Assigned', data: updatedCase });
      } catch (err) {
        res.status(500).json({ success: false, message: err.message });
      }
    },

    // PUT /api/emergency/dispatchAmbulance
    dispatchAmbulance: async (req, res) => {
      try {
        const { id, ambulanceNumber } = req.body;
        const updatedCase = await EmergencyCase.findOneAndUpdate(
          { id },
          { ambulanceDispatched: ambulanceNumber || 'PB01AB1234', status: 'Ambulance Dispatched' },
          { new: true }
        );

        if (io) {
          io.emit('ambulance_dispatched', updatedCase);
          io.emit('case_updated', updatedCase);
        }

        res.json({ success: true, message: 'Ambulance Dispatched', data: updatedCase });
      } catch (err) {
        res.status(500).json({ success: false, message: err.message });
      }
    },

    // PUT /api/emergency/allocateBed
    allocateBed: async (req, res) => {
      try {
        const { id, bedNumber } = req.body;
        const updatedCase = await EmergencyCase.findOneAndUpdate(
          { id },
          { bedAllocated: bedNumber || 'Bed-ICU-01', status: 'Treatment Started' },
          { new: true }
        );

        if (io) {
          io.emit('bed_allocated', updatedCase);
          io.emit('case_updated', updatedCase);
        }

        res.json({ success: true, message: 'Bed Allocated', data: updatedCase });
      } catch (err) {
        res.status(500).json({ success: false, message: err.message });
      }
    },

    // PUT /api/emergency/requestBlood
    requestBlood: async (req, res) => {
      try {
        const { id, bloodGroup } = req.body;
        const updatedCase = await EmergencyCase.findOneAndUpdate(
          { id },
          { bloodRequested: bloodGroup || 'O+' },
          { new: true }
        );

        if (io) {
          io.emit('blood_request', updatedCase);
        }

        res.json({ success: true, message: 'Blood Requested', data: updatedCase });
      } catch (err) {
        res.status(500).json({ success: false, message: err.message });
      }
    },

    // PUT /api/emergency/complete
    completeEmergency: async (req, res) => {
      try {
        const { id } = req.body;
        const updatedCase = await EmergencyCase.findOneAndUpdate(
          { id },
          { status: 'Completed' },
          { new: true }
        );

        if (io) {
          io.emit('case_completed', updatedCase);
          io.emit('case_updated', updatedCase);
        }

        res.json({ success: true, message: 'Case Completed', data: updatedCase });
      } catch (err) {
        res.status(500).json({ success: false, message: err.message });
      }
    }
  };
};

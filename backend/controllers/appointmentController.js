const Appointment = require('../models/Appointment');

module.exports = (io) => {
  return {
    getAppointments: async (req, res) => {
      try {
        const appointments = await Appointment.find().sort({ createdAt: -1 });
        res.json({ success: true, count: appointments.length, data: appointments });
      } catch (err) {
        res.status(500).json({ success: false, message: err.message });
      }
    },

    createAppointment: async (req, res) => {
      try {
        const count = await Appointment.countDocuments();
        const appointmentId = `APT2026${String(count + 1).padStart(5, '0')}`;
        
        const newAppointment = await Appointment.create({
          id: appointmentId,
          patientName: req.body.patientName || 'Anonymous Patient',
          doctorName: req.body.doctorName || 'Dr. Rajesh Sharma',
          department: req.body.department || 'General Medicine',
          date: req.body.date || new Date().toISOString().split('T')[0],
          timeSlot: req.body.timeSlot || '10:00 AM - 10:30 AM',
          status: 'Appointment Requested'
        });

        if (io) {
          io.emit('new_appointment', newAppointment);
        }

        res.status(201).json({
          success: true,
          message: 'Appointment booked successfully',
          data: newAppointment
        });
      } catch (err) {
        res.status(500).json({ success: false, message: err.message });
      }
    },

    approveAppointment: async (req, res) => {
      try {
        const { id } = req.body;
        const updated = await Appointment.findOneAndUpdate(
          { id },
          { status: 'Approved' },
          { new: true }
        );

        if (io) {
          io.emit('appointment_approved', updated);
        }

        res.json({ success: true, message: 'Appointment Approved', data: updated });
      } catch (err) {
        res.status(500).json({ success: false, message: err.message });
      }
    },

    rejectAppointment: async (req, res) => {
      try {
        const { id } = req.body;
        const updated = await Appointment.findOneAndUpdate(
          { id },
          { status: 'Cancelled' },
          { new: true }
        );

        if (io) {
          io.emit('appointment_cancelled', updated);
        }

        res.json({ success: true, message: 'Appointment Cancelled', data: updated });
      } catch (err) {
        res.status(500).json({ success: false, message: err.message });
      }
    },

    assignDoctor: async (req, res) => {
      try {
        const { id, doctorName } = req.body;
        const updated = await Appointment.findOneAndUpdate(
          { id },
          { doctorName: doctorName || 'Dr. Rajesh Sharma', status: 'Doctor Assigned' },
          { new: true }
        );

        if (io) {
          io.emit('doctor_assigned', updated);
        }

        res.json({ success: true, message: 'Doctor Assigned to Appointment', data: updated });
      } catch (err) {
        res.status(500).json({ success: false, message: err.message });
      }
    },

    completeAppointment: async (req, res) => {
      try {
        const { id } = req.body;
        const updated = await Appointment.findOneAndUpdate(
          { id },
          { status: 'Completed' },
          { new: true }
        );

        if (io) {
          io.emit('appointment_completed', updated);
        }

        res.json({ success: true, message: 'Appointment Completed', data: updated });
      } catch (err) {
        res.status(500).json({ success: false, message: err.message });
      }
    }
  };
};

const Staff = require('../models/Staff');

exports.getStaff = async (req, res) => {
  try {
    const staffMembers = await Staff.find().sort({ createdAt: -1 });
    res.json({ success: true, count: staffMembers.length, data: staffMembers });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.createStaff = async (req, res) => {
  try {
    const count = await Staff.countDocuments();
    const staffId = `STF-${101 + count}`;
    const newStaff = await Staff.create({
      id: staffId,
      name: req.body.name || 'New Staff Member',
      role: req.body.role || 'Receptionist',
      department: req.body.department || 'General Administration',
      phone: req.body.phone || '+91 98765 00000',
      email: req.body.email || 'staff@sanjeevanihospital.in',
      status: req.body.status || 'Active'
    });
    res.status(201).json({ success: true, message: 'Staff Member Created', data: newStaff });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateStaff = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await Staff.findOneAndUpdate({ id }, req.body, { new: true });
    res.json({ success: true, message: 'Staff Updated', data: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.deleteStaff = async (req, res) => {
  try {
    const { id } = req.params;
    await Staff.findOneAndDelete({ id });
    res.json({ success: true, message: 'Staff Deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

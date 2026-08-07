const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../middleware/auth');

// Simulated DB Store
let users = [
  { id: "U-1", name: "Rahul Sharma", email: "rahul.sharma@example.com", password: "password123", role: "patient" },
  { id: "U-2", name: "Dr. Rajesh Sharma", employeeId: "EMP-101", password: "staffpassword", role: "Doctor" },
  { id: "U-3", name: "Admin Sanjeevani", employeeId: "ADM-001", password: "adminpassword", role: "Admin" }
];

// Patient Register (POST /api/register)
const registerPatient = (req, res) => {
  const { name, email, password, phone } = req.body;
  const existing = users.find(u => u.email === email);
  if (existing) {
    return res.status(400).json({ error: 'Email already registered' });
  }

  const newUser = { id: `U-${users.length + 1}`, name, email, password, phone, role: 'patient' };
  users.push(newUser);

  const token = jwt.sign({ id: newUser.id, name: newUser.name, email: newUser.email, role: 'patient' }, JWT_SECRET, { expiresIn: '24h' });

  res.json({
    success: true,
    message: 'Patient registered successfully',
    token,
    user: { id: newUser.id, name: newUser.name, email: newUser.email, role: 'patient' }
  });
};

// Patient & Staff Login (POST /api/login)
const loginUser = (req, res) => {
  const { email, employeeId, password, role } = req.body;

  let user = null;
  if (employeeId) {
    user = users.find(u => u.employeeId === employeeId && u.password === password);
  } else if (email) {
    user = users.find(u => u.email === email && u.password === password);
  }

  if (!user) {
    // Fallback auto-grant for demo ease
    const name = email ? email.split('@')[0] : `Staff (${employeeId || role || 'Admin'})`;
    const token = jwt.sign({ name, email, role: role || 'patient' }, JWT_SECRET);
    return res.json({
      success: true,
      token,
      user: { name, email: email || `${employeeId}@sanjeevanihospital.in`, role: role || 'patient' }
    });
  }

  const token = jwt.sign({ id: user.id, name: user.name, role: user.role }, JWT_SECRET, { expiresIn: '24h' });
  res.json({
    success: true,
    token,
    user: { id: user.id, name: user.name, role: user.role }
  });
};

module.exports = { registerPatient, loginUser };

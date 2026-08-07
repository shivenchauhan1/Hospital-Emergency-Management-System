const express = require('express');
const http = require('http');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"]
  }
});

app.use(cors());
app.use(express.json());

const JWT_SECRET = "sanjeevani_hospital_jwt_secret_2026";

// In-Memory Database Store (MongoDB Mongoose Simulation)
let emergencyRequests = [
  {
    id: "ER-2026-00101",
    patientName: "Rahul Sharma",
    age: 42,
    gender: "Male",
    phone: "+91 98765 43210",
    emergencyType: "Heart Attack",
    address: "House 142, Sector 15, Chandigarh",
    description: "Severe crushing chest pain radiating to left arm",
    emergencyLevel: "Critical",
    status: "Approved",
    assignedDoctor: "Dr. Rajesh Sharma",
    ambulanceDispatched: "PB01AB1234",
    bedAssigned: "ICU Bay 3",
    timestamp: "10:14 AM"
  },
  {
    id: "ER-2026-00102",
    patientName: "Neha Kapoor",
    age: 61,
    gender: "Female",
    phone: "+91 98888 77766",
    emergencyType: "Stroke",
    address: "Kothi 89, Sector 9, Panchkula",
    description: "Sudden slurred speech and right-side weakness",
    emergencyLevel: "Critical",
    status: "Approved",
    assignedDoctor: "Dr. Priya Mehta",
    ambulanceDispatched: "CH02CD5678",
    bedAssigned: "Neuro ICU 2",
    timestamp: "10:22 AM"
  }
];

let bloodRequests = [
  {
    id: "BR-501",
    patientName: "Sneha Patel",
    patientId: "P-1006",
    group: "B-",
    units: 2,
    hospital: "Sanjeevani Multispeciality Hospital",
    doctor: "Dr. Meenakshi Joshi",
    status: "Pending Review",
    timestamp: "10:30 AM"
  }
];

let appointments = [];

// REST API Endpoints

// 1. Patient Auth
app.post('/api/auth/patient/signup', (req, res) => {
  const { name, email, password, phone } = req.body;
  const token = jwt.sign({ name, email, role: 'patient' }, JWT_SECRET);
  res.json({ success: true, token, user: { name, email, role: 'patient' } });
});

app.post('/api/auth/patient/login', (req, res) => {
  const { email } = req.body;
  const token = jwt.sign({ email, role: 'patient' }, JWT_SECRET);
  res.json({ success: true, token, user: { name: email.split('@')[0], email, role: 'patient' } });
});

// 2. Staff Auth (Role-based)
app.post('/api/auth/staff/login', (req, res) => {
  const { email, role } = req.body;
  const token = jwt.sign({ email, role }, JWT_SECRET);
  res.json({ success: true, token, user: { name: `Staff (${role})`, email, role } });
});

// 3. Emergency Requests Endpoints
app.get('/api/emergency/requests', (req, res) => {
  res.json(emergencyRequests);
});

app.post('/api/emergency/register', (req, res) => {
  const newId = `ER-2026-00${100 + emergencyRequests.length + 1}`;
  const newRequest = {
    id: newId,
    ...req.body,
    status: 'Pending Review',
    assignedDoctor: 'Unassigned',
    ambulanceDispatched: 'None',
    bedAssigned: 'Pending Allocation',
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  };

  emergencyRequests.unshift(newRequest);

  // Real-time broadcast to Staff Portal
  io.emit('patient:emergency_submitted', newRequest);

  res.json({
    success: true,
    message: "Your request has been sent successfully. Hospital staff will review your request shortly.",
    requestId: newId,
    request: newRequest
  });
});

// Staff Approves Request
app.put('/api/emergency/approve/:id', (req, res) => {
  const { id } = req.params;
  const item = emergencyRequests.find(r => r.id === id);
  if (item) {
    item.status = 'Approved';
    io.emit('staff:request_updated', item);
    res.json({ success: true, item });
  } else {
    res.status(404).json({ error: 'Request not found' });
  }
});

// Staff Assigns Doctor
app.put('/api/emergency/assign-doctor/:id', (req, res) => {
  const { id } = req.params;
  const { doctorName } = req.body;
  const item = emergencyRequests.find(r => r.id === id);
  if (item) {
    item.assignedDoctor = doctorName;
    item.status = 'Doctor Assigned';
    io.emit('staff:request_updated', item);
    res.json({ success: true, item });
  } else {
    res.status(404).json({ error: 'Request not found' });
  }
});

// Staff Dispatches Ambulance
app.put('/api/emergency/dispatch-ambulance/:id', (req, res) => {
  const { id } = req.params;
  const { ambulanceNumber } = req.body;
  const item = emergencyRequests.find(r => r.id === id);
  if (item) {
    item.ambulanceDispatched = ambulanceNumber;
    item.status = 'Ambulance Dispatched (108)';
    io.emit('staff:request_updated', item);
    res.json({ success: true, item });
  } else {
    res.status(404).json({ error: 'Request not found' });
  }
});

// Socket.IO Server Handlers
io.on('connection', (socket) => {
  console.log('⚡ Client Connected to Sanjeevani Real-Time Socket Server:', socket.id);

  socket.on('disconnect', () => {
    console.log('Client Disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🏥 Sanjeevani Hospital Backend Server running on port ${PORT}`);
});

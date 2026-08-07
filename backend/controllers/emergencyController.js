let emergencyStore = [
  {
    id: "ER20260012",
    patient: "Rahul Sharma",
    phone: "9876543210",
    emergencyType: "Accident",
    priority: "Critical",
    status: "Pending",
    doctor: null,
    ambulance: null,
    address: "Sector 32, Chandigarh",
    description: "Collision trauma near Tribune Chowk",
    createdAt: "2026-08-07T10:25:00.000Z"
  },
  {
    id: "ER20260015",
    patient: "Neha Kapoor",
    phone: "9888877766",
    emergencyType: "Stroke",
    priority: "Critical",
    status: "Approved",
    doctor: "Dr. Priya Mehta",
    ambulance: "CH02CD5678",
    address: "Kothi 89, Sector 9, Panchkula",
    description: "Sudden facial asymmetry and slurred speech",
    createdAt: "2026-08-07T10:15:00.000Z"
  }
];

// Patient Submits Emergency (POST /api/emergency)
const createEmergencyRequest = (req, res, io) => {
  const { patientName, phone, emergencyType, priority, address, description } = req.body;
  const requestId = `ER202600${10 + emergencyStore.length + 1}`;

  const newDoc = {
    id: requestId,
    patient: patientName || "Rahul Sharma",
    phone: phone || "9876543210",
    emergencyType: emergencyType || "Accident",
    priority: priority || "Critical",
    status: "Pending",
    doctor: null,
    ambulance: null,
    address: address || "Sector 32, Chandigarh",
    description: description || "Acute emergency trauma",
    createdAt: new Date().toISOString()
  };

  emergencyStore.unshift(newDoc);

  // Socket.IO Emit -> Staff Dashboard updates live
  if (io) {
    io.emit('emergency_request_created', newDoc);
  }

  res.json({
    success: true,
    message: "Your request has been sent successfully. Hospital staff will review your request shortly.",
    requestId,
    data: newDoc
  });
};

// Staff Fetches Emergency Queue (GET /api/emergency)
const getEmergencyRequests = (req, res) => {
  res.json(emergencyStore);
};

// Staff Updates Emergency Status / Approve / Reject (PUT /api/emergency/:id)
const updateEmergencyStatus = (req, res, io) => {
  const { id } = req.params;
  const { status, priority } = req.body;
  const doc = emergencyStore.find(e => e.id === id);

  if (doc) {
    if (status) doc.status = status;
    if (priority) doc.priority = priority;

    // Socket.IO Emit -> Patient Portal updates live
    if (io) {
      io.emit('emergency_request_updated', doc);
    }

    res.json({ success: true, data: doc });
  } else {
    res.status(404).json({ error: 'Emergency request not found' });
  }
};

// Staff Assigns Doctor (PUT /api/assignDoctor)
const assignDoctor = (req, res, io) => {
  const { requestId, doctorName } = req.body;
  const doc = emergencyStore.find(e => e.id === requestId);

  if (doc) {
    doc.doctor = doctorName || "Dr. Rajesh Sharma";
    doc.status = "Doctor Assigned";

    if (io) {
      io.emit('emergency_request_updated', doc);
    }

    res.json({ success: true, data: doc });
  } else {
    res.status(404).json({ error: 'Emergency request not found' });
  }
};

// Staff Dispatches Ambulance (PUT /api/dispatchAmbulance)
const dispatchAmbulance = (req, res, io) => {
  const { requestId, ambulanceNumber } = req.body;
  const doc = emergencyStore.find(e => e.id === requestId);

  if (doc) {
    doc.ambulance = ambulanceNumber || "PB01AB1234";
    doc.status = "Ambulance Dispatched";

    if (io) {
      io.emit('emergency_request_updated', doc);
    }

    res.json({ success: true, data: doc });
  } else {
    res.status(404).json({ error: 'Emergency request not found' });
  }
};

module.exports = {
  createEmergencyRequest,
  getEmergencyRequests,
  updateEmergencyStatus,
  assignDoctor,
  dispatchAmbulance,
  emergencyStore
};

require('dotenv').config();
const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');
const connectDB = require('./config/db');
const seedHospitalData = require('./config/seed');

// Custom DSA Hydration
const CaseCache = require('./dsa/CaseCache');
const { bedAllocatorInstance } = require('./controllers/bedController');
const EmergencyCase = require('./models/EmergencyCase');
const Bed = require('./models/Bed');

const app = express();
const server = http.createServer(app);

// Socket.IO Server Configuration
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// Initialize Database Connection, Seed Data & Hydrate DSA Caches
connectDB().then(async () => {
  await seedHospitalData();

  try {
    // 1. Hydrate O(1) CaseCache Hashmap from MongoDB
    const allCases = await EmergencyCase.find();
    CaseCache.hydrate(allCases);
    console.log(`⚡ CaseCache hydrated with ${CaseCache.size()} emergency cases`);

    // 2. Hydrate BedAllocator Free-Lists from MongoDB
    const allBeds = await Bed.find();
    bedAllocatorInstance.hydrate(allBeds);
    console.log(`🛏️ BedAllocator hydrated free-lists:`, bedAllocatorInstance.getFreeCounts());
  } catch (err) {
    console.error('❌ Error hydrating DSA Data Structures:', err.message);
  }
});

// API Routes Injection
const authRoutes = require('./routes/authRoutes');
const createEmergencyRoutes = require('./routes/emergencyRoutes');
const createAppointmentRoutes = require('./routes/appointmentRoutes');
const doctorRoutes = require('./routes/doctorRoutes');
const departmentRoutes = require('./routes/departmentRoutes');
const ambulanceRoutes = require('./routes/ambulanceRoutes');
const createBedRoutes = require('./routes/bedRoutes');
const bloodRoutes = require('./routes/bloodRoutes');
const createPatientRoutes = require('./routes/patientRoutes');
const staffRoutes = require('./routes/staffRoutes');

app.use('/api', authRoutes);
app.use('/api/emergency', createEmergencyRoutes(io));
app.use('/api/appointment', createAppointmentRoutes(io));
app.use('/api/doctors', doctorRoutes);
app.use('/api/departments', departmentRoutes);
app.use('/api/ambulances', ambulanceRoutes);
app.use('/api/beds', createBedRoutes(io));
app.use('/api/blood', bloodRoutes);
app.use('/api/patient', createPatientRoutes(io));
app.use('/api/patients', createPatientRoutes(io));
app.use('/api/staff', staffRoutes);

// Helper Root Status Endpoint
app.get('/', (req, res) => {
  res.json({
    status: "Active",
    server: "Sanjeevani Multispeciality Hospital Backend API with Custom DSA Engine",
    location: "Sector 32, Chandigarh",
    socketEngine: "Socket.IO Real-Time Enabled",
    dsaModules: [
      "PriorityQueue (Binary Min-Heap Triage)",
      "Graph + Dijkstra (Ambulance Route Optimization)",
      "CaseCache (O(1) Hash Map Cache)",
      "BedAllocator (Greedy Interval Free-List Stacks)",
      "LRUCache (Doubly Linked List + Map Report Cache)",
      "UnionFind (Disjoint-Set Blood Group Compatibility)"
    ]
  });
});

// Socket.IO Engine Connections
io.on('connection', (socket) => {
  console.log(`⚡ Client Connected to Real-Time Engine (Socket ID: ${socket.id})`);

  socket.on('disconnect', () => {
    console.log(`🔌 Client Disconnected (Socket ID: ${socket.id})`);
  });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "API endpoint not found"
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("❌ Internal Error:", err);
  res.status(500).json({
    success: false,
    message: "Internal Server Error"
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🏥 Sanjeevani Hospital Backend Engine live on port ${PORT}`);
});

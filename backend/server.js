require('dotenv').config();
const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');
const connectDB = require('./config/db');

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

// Initialize Database Connection
connectDB();

// API Routes Injection
const authRoutes = require('./routes/authRoutes');
const createEmergencyRoutes = require('./routes/emergencyRoutes');

app.use('/api', authRoutes);
app.use('/api/emergency', createEmergencyRoutes(io));

// Helper Root Status Endpoint
app.get('/', (req, res) => {
  res.json({
    status: "Active",
    server: "Sanjeevani Multispeciality Hospital Backend API",
    location: "Sector 32, Chandigarh",
    socketEngine: "Socket.IO Real-Time Enabled",
    endpoints: [
      "POST /api/register",
      "POST /api/login",
      "POST /api/emergency",
      "GET /api/emergency",
      "PUT /api/emergency/:id",
      "PUT /api/emergency/assignDoctor",
      "PUT /api/emergency/dispatchAmbulance"
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

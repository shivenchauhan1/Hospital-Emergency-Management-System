const setupSocket = (io) => {
  io.on('connection', (socket) => {
    console.log(`⚡ HEMS Real-Time Socket Connected: ${socket.id}`);

    // Patient submits emergency
    socket.on('patient_submit_emergency', (data) => {
      console.log('📢 Emergency Received:', data.id);
      io.emit('new_emergency_alert', data);
    });

    // Staff approves/assigns/dispatches
    socket.on('staff_update_emergency', (data) => {
      console.log('🔄 Emergency Updated:', data.id, data.status);
      io.emit('emergency_status_changed', data);
    });

    socket.on('disconnect', () => {
      console.log(`🔌 Client Disconnected: ${socket.id}`);
    });
  });
};

module.exports = setupSocket;

import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'https://hospital-emergency-management-system-1qmx.onrender.com';

export const socket = io(SOCKET_URL, {
  autoConnect: true,
  reconnection: true,
  reconnectionAttempts: 10,
  reconnectionDelay: 1000
});

socket.on('connect', () => {
  console.log('⚡ Connected to Sanjeevani Real-Time Socket Engine at:', SOCKET_URL);
});

socket.on('disconnect', () => {
  console.log('🔌 Disconnected from Real-Time Engine');
});

export default socket;

import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

export const socket = io(SOCKET_URL, {
  autoConnect: true,
  reconnection: true,
  reconnectionAttempts: 10,
  reconnectionDelay: 1000
});

socket.on('connect', () => {
  console.log('⚡ Connected to Sanjeevani Real-Time Socket Engine');
});

socket.on('disconnect', () => {
  console.log('🔌 Disconnected from Real-Time Engine');
});

export default socket;

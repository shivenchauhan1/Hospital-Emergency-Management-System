import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'https://hospital-emergency-management-system-1qmx.onrender.com';

export const socket = io(SOCKET_URL, {
  autoConnect: true,
  reconnection: true,
  reconnectionAttempts: 10,
  reconnectionDelay: 1000
});

socket.on('connect', () => {
  console.log('⚡ Staff Operations Portal Connected to Socket.IO Engine at:', SOCKET_URL);
});

export default socket;

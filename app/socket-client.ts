// socket-client.ts
'use client';

import { io } from 'socket.io-client';

const socket = io('https://futsal-booking-system-production.up.railway.app', {
  autoConnect: false,
  transports: ['polling'], // force websocket
  withCredentials: true,
});

export default socket;

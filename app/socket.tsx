// socket.js
import { io } from "socket.io-client";

// Replace with your backend URL (e.g., production URL when deploying)
const URL = "http://localhost:5000"; 

const socket = io(URL, {
  autoConnect: false, // Connect manually after authentication or on component mount
  transports: ["websocket"],
});

export default socket;
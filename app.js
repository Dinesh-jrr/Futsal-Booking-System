const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const futsalRoutes=require('./routes/futsalRoutes');
const paymentRoutes=require('./routes/paymentRoutes');
const chatRoutes=require('./routes/chatRoutes');
const bodyParser = require('body-parser');
const cors = require('cors');
const http = require('http');

//real-time chat sysstem(circuit.io)
// import {Server} from 'socket.io';
const socketIo =require('socket.io');

dotenv.config();
console.log('Mongo URI:', process.env.MONGO_URI);
connectDB();

const app = express();
const server = http.createServer(app);
app.use(bodyParser.json());
app.use(cors());

// Routes
//user routes
app.use('/api/users', userRoutes);

//bookings routes
app.use('/api', bookingRoutes);

//futsal routes
app.use('/api',futsalRoutes);

//payments routes
app.use('/api',paymentRoutes);

//chat routes
app.use('/api/chat',chatRoutes);

//real time chat(socket.io)
const io = new socketIo.Server(server, {
  cors: {
    origin: '*', // You can specify frontend URL here for better security
    methods: ['GET', 'POST'],
  },
});

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Listen for incoming chat messages
  socket.on('chat message', (msg) => {
    console.log('Message received:', msg);
    io.emit('chat message', msg); // Broadcast the message to all clients
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});


const PORT = process.env.PORT || 5000;
server.listen(PORT,'0.0.0.0', () => console.log(`Server running on port ${PORT}`));

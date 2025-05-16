const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const futsalRoutes = require('./routes/futsalRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const chatRoutes = require('./routes/chatRoutes');
const notificationRoutes=require('./routes/notificationRoutes');
const tokenRoutes = require('./routes/tokenRoutes');
const opponentRoutes=require('./routes/opponentRoutes');
const reviewRoutes=require('./routes/reviewRoutes');
const bodyParser = require('body-parser');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

// Create Express app and HTTP server
const app = express();
const server = http.createServer(app);

// Middleware
app.use(bodyParser.json());
app.use(cors({
  origin: 'http://localhost:3000', // or whatever your frontend address is
  credentials: true
}));

// API Routes
app.use('/api/users', userRoutes);
app.use('/api', bookingRoutes);
app.use('/api', futsalRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/notification',notificationRoutes);
app.use('/api', tokenRoutes);
app.use('/api/opponent',opponentRoutes);
app.use('/api/review',reviewRoutes);
// Socket.IO setup
const io = new socketIo.Server(server, {
  cors: {
    origin: ['https://futsal-booking-system-production.up.railway.app', 'http://localhost:3000'],
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

// User ID to socket ID mapping
const users = {};

io.on('connection', (socket) => {
  console.log('⚡ User connected:', socket.id);

  // Client notifies server it's ready
  socket.on('client_ready', (msg) => {
    console.log('✅ Client Ready:', msg);
  });

  // Join user-specific room using their userId
  socket.on('join', (userId) => {
    users[userId] = socket.id;
    socket.join(userId); // allows targeted messaging
    console.log(`📥 User ${userId} joined room ${userId}`);
  });

  // Handle sending messages
  socket.on('sendMessage', ({ senderId, receiverId, message }) => {
    console.log(`📨 Message from ${senderId} to ${receiverId}: ${message}`);

    const timestamp = new Date().toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });

    const messageData = {
      sender: 'Them', // Change based on backend user mapping
      content: message,
      timestamp,
    };

    // Emit to specific receiver if they're connected
    if (users[receiverId]) {
      io.to(users[receiverId]).emit('newMessage', messageData);
      console.log(`📤 Message sent to ${receiverId}`);
    } else {
      console.log(`❌ User ${receiverId} not connected`);
    }
  });

  socket.on('disconnect', () => {
    console.log('❎ User disconnected:', socket.id);

    // Clean up user from map
    for (const userId in users) {
      if (users[userId] === socket.id) {
        delete users[userId];
        break;
      }
    }
  });
});

//setting up notification feature in system

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, '0.0.0.0', () => console.log(`🚀 Server running on port ${PORT}`));

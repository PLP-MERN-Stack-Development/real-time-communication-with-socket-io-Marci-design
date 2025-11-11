// server.js - Main server file for Socket.io chat application

const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const jwt = require('jsonwebtoken');  
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

// Import data models
const models = {
  User: require('./models/User'),
  Message: require('./models/Message'),
  Room: require('./models/Room'),
  Attachment: require('./models/Attachment'),
  Activity: require('./models/Activity'),
};

// Initialize Express app
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Mount API routes
app.use('/api/auth', require(path.join(__dirname, 'routes', 'auth')));
app.use('/api/messages', require(path.join(__dirname, 'routes', 'messages')));
app.use('/api/users', require(path.join(__dirname, 'routes', 'users')));
app.use('/api/rooms', require(path.join(__dirname, 'routes', 'rooms')));
app.use('/health', require(path.join(__dirname, 'routes', 'health')));

// Store connected users and messages
const users = {};
const messages = [];
const typingUsers = {};

// Delegate Socket.IO handlers to socket/handlers.js for better separation of concerns
require(path.join(__dirname, 'socket', 'handlers'))(io, { users, messages, typingUsers });

// Old API routes (kept for compatibility, but prefer the new route files above)
// app.get('/api/messages', (req, res) => {
//   res.json(messages);
// });
//
// app.get('/api/users', (req, res) => {
//   res.json(Object.values(users));
// });

// Root route
app.get('/', (req, res) => {
  res.send('Socket.io Chat Server is running');
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = { app, server, io, models }; 
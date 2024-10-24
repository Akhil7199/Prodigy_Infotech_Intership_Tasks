const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');
const Message = require('./models/Message');  // Make sure the Message model exists

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
  },
});

app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect('mongodb://localhost:27017', { 
  useNewUrlParser: true, 
  useUnifiedTopology: true 
})
  .then(() => console.log('MongoDB connected successfully'))
  .catch((err) => console.error('MongoDB connection error:', err));

// WebSocket connection
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  // User joins a room
  socket.on('join-room', (room) => {
    socket.join(room);
    console.log(`${socket.id} joined room ${room}`);
  });

  // Listen for chat messages and save to DB
  socket.on('chat-message', async ({ room, message, sender }) => {
    try {
      // Save the message to the database
      const newMessage = new Message({ room, content: message, sender });
      await newMessage.save();

      // Broadcast the message to the room
      io.to(room).emit('chat-message', { sender, message });
    } catch (error) {
      console.error('Error saving message:', error);
    }
  });

  // Handle user disconnect
  socket.on('disconnect', () => {
    console.log('A user disconnected:', socket.id);
  });
});

// Start the server
server.listen(5000, () => {
  console.log('Server is running on port 5000');
});

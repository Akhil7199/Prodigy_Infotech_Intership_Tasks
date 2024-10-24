const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/auth');  // Authentication routes
const app = express();
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

// Middleware
app.use(express.json());
app.use(cors());

// Database connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error(err));

// Routes
app.use('/api/auth', authRoutes);  // Use the auth routes

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const adminRoutes = require('./routes/adminRoutes');
const userRoutes = require('./routes/userRoutes');
const apiRoutes = require('./routes/api');
const registrationRoutes = require('./routes/registrationRoutes');
const registrationsRoutes = require('./routes/registrationsRoutes');

// Load environment variables
dotenv.config();

const app = express();

app.use(cors({
  origin: 'http://localhost:5173', // Your frontend URL
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/mahotsav')
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/admin', adminRoutes);
app.use('/api/users', userRoutes);
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API routes
app.use('/api/events', apiRoutes);
app.use('/api/registrations', registrationRoutes);
app.use('/api/registration', registrationsRoutes);

// Start server
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const morgan = require('morgan');
const config = require('./src/config/config');

// Import routes
const authRoutes = require('./src/routes/auth.routes');
const teacherRoutes = require('./src/routes/teacher.routes');
const attendanceRoutes = require('./src/routes/attendance.routes');

// Initialize app
const app = express();
const PORT = config.PORT;

// CORS Options
const corsOptions = {
  origin: ['https://hazri-system.vercel.app', 'http://localhost:5173'],
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  optionsSuccessStatus: 204,
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(morgan('dev'));

// Connect to MongoDB
mongoose.connect(config.MONGODB_URI)
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => console.error('MongoDB connection error:', err));

// Test endpoint (no auth required)
app.get('/api/test', (req, res) => {
  console.log('Test endpoint called');
  res.json({ 
    message: 'API is working',
    timestamp: new Date().toISOString() 
  });
});

// Define routes
app.use('/api/auth', authRoutes);
app.use('/api/teachers', teacherRoutes);
app.use('/api/attendance', attendanceRoutes);

// Root route
app.get('/', (req, res) => {
  res.send('Hazri System API is running');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const authRoutes = require('./routes/auth');
const busRoutes = require('./routes/buses');
const bookingRoutes = require('./routes/bookings');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware - CORS must be first!
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: false
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/buses', busRoutes);
app.use('/api/bookings', bookingRoutes);

// Test route
app.get('/', (req, res) => {
  res.json({ message: 'Bus Booking API is running!' });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

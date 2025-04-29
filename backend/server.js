require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // for parsing application/json

// Basic route
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Import routes
const formRoutes = require('./routes/formRoutes');

// Mount Routers
app.use('/api/forms', formRoutes);


// Basic Error Handling Middleware (Should be last)
app.use((err, req, res, next) => {
  console.error(err.stack);
  // Check if the error is a Mongoose validation error
  if (err.name === 'ValidationError') {
    return res.status(400).json({ message: err.message, errors: err.errors });
  }
  // Check for Mongoose CastError (e.g., invalid ObjectId format)
  if (err.name === 'CastError' && err.kind === 'ObjectId') {
      return res.status(400).json({ message: `Invalid ${err.path}: ${err.value}` });
  }
  // Default to 500 server error
  res.status(err.status || 500).json({
    message: err.message || 'Something went wrong!',
    // Provide stack trace only in development (optional)
    // stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });
});


const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

// Check if MONGO_URI is defined
if (!MONGO_URI) {
  console.error('Error: MONGO_URI is not defined in your .env file');
  process.exit(1); // Exit the application if MONGO_URI is not set
}

// Connect to MongoDB
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('MongoDB connected successfully');
    // Start the server only after successful DB connection
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1); // Exit the application on connection error
  });

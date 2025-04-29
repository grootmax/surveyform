require('dotenv').config(); // Load environment variables from .env file
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose'); // Uncomment mongoose

// Import routes
const formRoutes = require('./routes/formRoutes'); // Import form routes

const app = express();
const PORT = process.env.PORT || 5001; // Use port from .env or default to 5001

// Middleware
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(express.json()); // Parse JSON request bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded request bodies

// Basic Test Route
app.get('/api/test', (req, res) => {
  res.json({ message: 'Server is running!' });
});

// Use Routes
app.use('/api/forms', formRoutes); // Mount form routes
// app.use('/api/responses', require('./routes/responseRoutes')); // Placeholder for future response routes

// Database Connection
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            // Options like useNewUrlParser and useUnifiedTopology are no longer needed in Mongoose v6+
            // Add other options if required by your MongoDB version or setup
        });
        console.log('MongoDB connected successfully.');
    } catch (err) {
        console.error('MongoDB connection error:', err.message);
        // Exit process with failure
        process.exit(1);
    }
};

connectDB(); // Call the function to connect to the database


// Basic Error Handling Middleware (Example - can be enhanced)
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});


// Start the server only after DB connection attempt (or handle errors appropriately)
// Mongoose connection is now async, so starting server inside .then or after await
// For simplicity here, we start immediately, but connectDB handles exit on error.
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

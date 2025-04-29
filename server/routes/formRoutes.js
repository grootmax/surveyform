const express = require('express');
const router = express.Router();
const Form = require('../models/Form'); // Import the Form model
const mongoose = require('mongoose'); // Import mongoose to validate ObjectId

// @route   POST /api/forms
// @desc    Create a new form
// @access  Public (consider adding auth later)
router.post('/', async (req, res) => {
    const { title, description, questions } = req.body;

    // Basic validation (Mongoose will also validate based on schema)
    if (!title || !questions || !Array.isArray(questions) || questions.length === 0) {
        return res.status(400).json({ message: 'Title and at least one question are required.' });
    }

    // Additional validation for question structure could be added here if needed

    try {
        const newForm = new Form({
            title,
            description,
            questions,
            // createdBy: req.user.id // Example if auth was implemented
        });

        const savedForm = await newForm.save();
        res.status(201).json(savedForm); // Respond with the created form data
    } catch (error) {
        console.error('Error creating form:', error);
        // Check for Mongoose validation errors
        if (error.name === 'ValidationError') {
            // Extract validation messages
            const messages = Object.values(error.errors).map(val => val.message);
            return res.status(400).json({ message: 'Validation failed', errors: messages });
        }
        res.status(500).json({ message: 'Server error while creating form.' });
    }
});

// @route   GET /api/forms/:id
// @desc    Get a specific form by ID
// @access  Public (consider adding auth later)
router.get('/:id', async (req, res) => {
    const { id } = req.params;

    // Validate if the provided ID is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid Form ID format.' });
    }

    try {
        const form = await Form.findById(id);

        if (!form) {
            return res.status(404).json({ message: 'Form not found.' });
        }

        res.status(200).json(form); // Respond with the found form data
    } catch (error) {
        console.error('Error fetching form:', error);
        // Handle potential CastError if ID format is valid but causes issues during query
        if (error.name === 'CastError') {
             return res.status(400).json({ message: 'Invalid Form ID.' });
        }
        res.status(500).json({ message: 'Server error while fetching form.' });
    }
});


// Add other form-related routes (PUT, DELETE, GET all forms) here later

module.exports = router;

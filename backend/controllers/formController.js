const mongoose = require('mongoose'); // Added mongoose import
const Form = require('../models/Form');

// @desc    Create a new form
// @route   POST /api/forms
// @access  Public // Decide on access control later
exports.createForm = async (req, res, next) => {
  try {
    const { title, description, questions } = req.body;

    // Basic validation
    if (!title || !questions || !Array.isArray(questions) || questions.length === 0) {
      return res.status(400).json({ message: 'Form title and at least one question are required.' });
    }

    // Add more validation for question structure if needed

    const newForm = new Form({
      title,
      description,
      questions,
    });

    const savedForm = await newForm.save();
    res.status(201).json(savedForm);
  } catch (error) {
    // Pass error to the error handling middleware
    next(error);
  }
};

// @desc    Get a form by ID
// @route   GET /api/forms/:id
// @access  Public // Decide on access control later
exports.getFormById = async (req, res, next) => {
  try {
    const formId = req.params.id;
    // Basic validation for ObjectId format (optional but recommended)
    if (!mongoose.Types.ObjectId.isValid(formId)) {
        return res.status(400).json({ message: 'Invalid Form ID format' });
    }

    const form = await Form.findById(formId);

    if (!form) {
      return res.status(404).json({ message: 'Form not found' });
    }

    res.status(200).json(form);
  } catch (error) {
    // Pass error to the error handling middleware
    next(error);
  }
};

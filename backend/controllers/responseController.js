const mongoose = require('mongoose');
const Response = require('../models/Response');
const Form = require('../models/Form'); // Need Form model to check if form exists

// @desc    Submit a response to a specific form
// @route   POST /api/forms/:formId/responses
// @access  Public // Decide on access control later
exports.submitResponse = async (req, res, next) => {
  try {
    const formId = req.params.formId;
    const { answers } = req.body;

    // Basic validation
    if (!mongoose.Types.ObjectId.isValid(formId)) {
      return res.status(400).json({ message: 'Invalid Form ID format' });
    }
    if (!answers || !Array.isArray(answers) || answers.length === 0) {
      return res.status(400).json({ message: 'Answers array is required and cannot be empty.' });
    }

    // Check if the form exists
    const formExists = await Form.findById(formId);
    if (!formExists) {
      return res.status(404).json({ message: 'Form not found. Cannot submit response.' });
    }

    // Add more validation here if needed:
    // - Compare answers structure/questions with the actual form questions
    // - Validate answerValue types based on questionType

    const newResponse = new Response({
      formId,
      answers,
    });

    const savedResponse = await newResponse.save();
    res.status(201).json(savedResponse);
  } catch (error) {
    // Pass error to the error handling middleware
    next(error);
  }
};

// @desc    Get all responses for a specific form
// @route   GET /api/forms/:formId/responses
// @access  Public // Decide on access control later
exports.getResponsesByFormId = async (req, res, next) => {
  try {
    const formId = req.params.formId;

    // Basic validation for ObjectId format
    if (!mongoose.Types.ObjectId.isValid(formId)) {
      return res.status(400).json({ message: 'Invalid Form ID format' });
    }

    // Optional: Check if the form itself exists before fetching responses
    // const formExists = await Form.findById(formId);
    // if (!formExists) {
    //   return res.status(404).json({ message: 'Form not found.' });
    // }

    const responses = await Response.find({ formId: formId }); //.sort({ createdAt: -1 }); // Optional sort

    // It's okay if responses is an empty array if no responses have been submitted yet.
    res.status(200).json(responses);
  } catch (error) {
    // Pass error to the error handling middleware
    next(error);
  }
};

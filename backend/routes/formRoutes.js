const express = require('express');
const router = express.Router();

// Import controllers
const formController = require('../controllers/formController');
const responseController = require('../controllers/responseController'); // For nested routes

// Form routes
router.post('/', formController.createForm);
router.get('/:id', formController.getFormById);

// Nested Response routes
// POST /api/forms/:formId/responses
router.post('/:formId/responses', responseController.submitResponse);
// GET /api/forms/:formId/responses
router.get('/:formId/responses', responseController.getResponsesByFormId);


module.exports = router;

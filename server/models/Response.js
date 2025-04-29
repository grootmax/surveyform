const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Sub-schema for individual answers within a response
const AnswerSchema = new Schema({
    questionId: { // Link to the specific question in the Form model
        type: Schema.Types.ObjectId,
        required: true,
        // Consider adding ref: 'Form.questions' if possible, though direct ref to subdoc ID is tricky
        // Validation might need to happen at the application level
    },
    questionLabel: { // Store label for easier display, denormalized
         type: String,
         required: true,
    },
    value: { // The actual answer value (String, Array of Strings for multi-select, etc.)
        type: Schema.Types.Mixed, // Flexible to store different answer types
        required: [true, 'Answer value is required'],
    },
}, { _id: false }); // Answers don't necessarily need their own top-level ID

// Main schema for the Response
const ResponseSchema = new Schema({
    formId: {
        type: Schema.Types.ObjectId,
        ref: 'Form', // Reference to the Form this response belongs to
        required: [true, 'Form ID is required'],
        index: true, // Index for faster querying of responses by form
    },
    answers: [AnswerSchema], // Embed the AnswerSchema as an array
    submittedAt: {
        type: Date,
        default: Date.now,
    },
    // Add potential fields like 'submittedBy' (linking to a User model or storing IP/session info) later
});

module.exports = mongoose.model('Response', ResponseSchema);

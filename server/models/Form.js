const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define possible question types
const QuestionType = Object.freeze({
    TEXT: 'text',
    MULTIPLE_CHOICE: 'multiple_choice',
    // Add other types like 'checkbox', 'dropdown', 'date' later
});

// Sub-schema for questions within a form
const QuestionSchema = new Schema({
    type: {
        type: String,
        enum: Object.values(QuestionType), // Use defined enum values
        required: [true, 'Question type is required'],
    },
    label: {
        type: String,
        required: [true, 'Question label is required'],
        trim: true,
    },
    options: [{ // Only relevant for types like multiple_choice, checkbox, dropdown
        type: String,
        trim: true,
    }],
    // Add other potential fields like 'required' (boolean) later
}, { _id: true }); // Ensure each question gets its own ID

// Main schema for the Form
const FormSchema = new Schema({
    title: {
        type: String,
        required: [true, 'Form title is required'],
        trim: true,
    },
    description: {
        type: String,
        trim: true,
    },
    questions: [QuestionSchema], // Embed the QuestionSchema as an array
    // Add other fields like 'createdBy' (linking to a User model) later
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});

// Middleware to update `updatedAt` field on save
FormSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

// Ensure QuestionType enum is accessible if needed elsewhere
FormSchema.statics.QuestionType = QuestionType;

module.exports = mongoose.model('Form', FormSchema);

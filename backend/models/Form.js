const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const QuestionSchema = new Schema({
  questionText: {
    type: String,
    required: true,
  },
  questionType: {
    type: String,
    required: true,
    enum: ['text', 'multiple-choice', 'checkbox', 'dropdown'], // Example types
  },
  options: {
    type: [String],
    // Required only if questionType needs options
    required: function() {
      return ['multiple-choice', 'checkbox', 'dropdown'].includes(this.questionType);
    },
    default: undefined // Ensure options is not created if not needed
  },
}, { _id: false }); // Don't create separate IDs for subdocuments

const FormSchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  questions: [QuestionSchema], // Array of question subdocuments
}, { timestamps: true }); // Add createdAt and updatedAt timestamps

module.exports = mongoose.model('Form', FormSchema);

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AnswerSchema = new Schema({
  questionText: {
    type: String,
    required: true,
  },
  // Using Schema.Types.Mixed for flexibility, but validate based on question type in controller if needed.
  // Alternatively, could have separate fields like answerString, answerArray based on question type.
  answerValue: {
    type: Schema.Types.Mixed, // Can store String, [String], etc.
    required: true,
  },
}, { _id: false }); // Don't create separate IDs for subdocuments

const ResponseSchema = new Schema({
  formId: {
    type: Schema.Types.ObjectId,
    ref: 'Form', // Reference to the Form model
    required: true,
    index: true, // Add index for faster queries based on formId
  },
  answers: [AnswerSchema], // Array of answer subdocuments
}, { timestamps: true }); // Add createdAt and updatedAt timestamps

module.exports = mongoose.model('Response', ResponseSchema);

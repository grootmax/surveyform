import React from 'react';

const QUESTION_TYPES = ['text', 'multiple-choice', 'checkbox', 'dropdown'];

function QuestionEditor({ question, index, onQuestionChange, onRemoveQuestion }) {

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const updatedQuestion = { ...question, [name]: value };

    // Reset options if type changes away from one that needs them
    if (name === 'questionType' && !['multiple-choice', 'checkbox', 'dropdown'].includes(value)) {
      updatedQuestion.options = [];
    } else if (name === 'questionType' && ['multiple-choice', 'checkbox', 'dropdown'].includes(value) && (!updatedQuestion.options || updatedQuestion.options.length === 0)) {
       // Initialize with one empty option if switching to a type that needs options
       updatedQuestion.options = [''];
    }

    onQuestionChange(index, updatedQuestion);
  };

  const handleOptionChange = (optionIndex, value) => {
    const newOptions = [...question.options];
    newOptions[optionIndex] = value;
    onQuestionChange(index, { ...question, options: newOptions });
  };

  const handleAddOption = () => {
    const newOptions = [...question.options, '']; // Add a new empty option
    onQuestionChange(index, { ...question, options: newOptions });
  };

  const handleRemoveOption = (optionIndex) => {
    const newOptions = question.options.filter((_, i) => i !== optionIndex);
    onQuestionChange(index, { ...question, options: newOptions });
  };

  const needsOptions = ['multiple-choice', 'checkbox', 'dropdown'].includes(question.questionType);

  return (
    // Add main class for the component
    <div className="question-editor">
      <h4>Question {index + 1}</h4>
      <div className="mb-3"> {/* Add margin bottom */}
        <label htmlFor={`questionText-${index}`}>Question Text:</label>
        <input
          type="text"
          id={`questionText-${index}`}
          name="questionText"
          value={question.questionText}
          onChange={handleInputChange}
          placeholder="Enter question text"
          required
        />
      </div>
      <div className="mb-3"> {/* Add margin bottom */}
        <label htmlFor={`questionType-${index}`}>Question Type:</label>
        <select
          id={`questionType-${index}`}
          name="questionType"
          value={question.questionType}
          onChange={handleInputChange}
        >
          {QUESTION_TYPES.map(type => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
      </div>

      {needsOptions && (
        // Add class for options section
        <div className="options-section">
          <h5>Options:</h5>
          {question.options && question.options.map((option, optionIndex) => (
            // Add class for each option item
            <div key={optionIndex} className="option-item">
              <input
                type="text"
                value={option}
                onChange={(e) => handleOptionChange(optionIndex, e.target.value)}
                placeholder={`Option ${optionIndex + 1}`}
              />
              {question.options.length > 1 && (
                 // Add class for remove button
                 <button type="button" onClick={() => handleRemoveOption(optionIndex)} className="danger">Remove</button>
              )}
            </div>
          ))}
          {/* Add class for add option button */}
          <button type="button" onClick={handleAddOption} className="add-option-btn mt-2">Add Option</button>
        </div>
      )}

      {/* Add classes for remove question button */}
       <button
         type="button"
         onClick={() => onRemoveQuestion(index)}
         className="danger remove-question-btn" // Use danger class and specific class
       >
         Remove Question
       </button>
       {/* Clear float */}
       <div style={{ clear: 'both' }}></div>
    </div>
  );
}

export default QuestionEditor;

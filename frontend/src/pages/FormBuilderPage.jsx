import React, { useState } from 'react';
import QuestionEditor from '../components/QuestionEditor';
import { createForm } from '../services/api'; // Import the API function
import { useNavigate } from 'react-router-dom'; // Import for potential redirect

function FormBuilderPage() {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [questions, setQuestions] = useState([
    // Start with one default question or empty
    // Start with one default question
    { questionText: '', questionType: 'text', options: [] }
  ]);
  const [statusMessage, setStatusMessage] = useState(''); // For success/error messages

  // --- Implemented functions ---
  const handleAddQuestion = () => {
    setQuestions([
        ...questions,
        // Add a new default question object
        { questionText: '', questionType: 'text', options: [] }
    ]);
     setStatusMessage(''); // Clear status on modification
  };

  const handleQuestionChange = (index, updatedQuestion) => {
    const newQuestions = [...questions];
    newQuestions[index] = updatedQuestion;
    setQuestions(newQuestions);
     setStatusMessage(''); // Clear status on modification
  };

  const handleRemoveQuestion = (index) => {
    const newQuestions = questions.filter((_, i) => i !== index);
    setQuestions(newQuestions);
     setStatusMessage(''); // Clear status on modification
  };

  // Implemented save function
  const handleSaveForm = async () => {
    setStatusMessage('Saving...');
    // Basic Validation
    if (!title.trim()) {
        setStatusMessage('Error: Form title is required.');
        return;
    }
    if (questions.length === 0) {
        setStatusMessage('Error: At least one question is required.');
        return;
    }
    // Add more validation if needed (e.g., check for empty question text)

    const formData = {
      title: title.trim(),
      description: description.trim(),
      questions: questions, // Send the whole questions array
    };

    try {
      const savedForm = await createForm(formData);
      setStatusMessage(`Success: Form "${savedForm.title}" created with ID: ${savedForm._id}`);
      // Optionally, reset the form state after a short delay
      // setTimeout(() => {
      //   setTitle('');
      //   setDescription('');
      //   setQuestions([{ questionText: '', questionType: 'text', options: [] }]);
      //   setStatusMessage('');
      // }, 2000);

      // Optionally, redirect after a short delay
      // setTimeout(() => {
      //   navigate(`/form/${savedForm._id}`); // Example redirect
      // }, 1500);


    } catch (error) {
       console.error("Save failed:", error);
       // Use error message from backend if available, otherwise use a generic message
       const message = error.message || 'An error occurred while saving the form.';
       setStatusMessage(`Error: ${message}`);
    }
  };
  // --- End Implemented functions ---


  return (
    // Add page container class
    <div className="form-builder-page">
      <h2>Create New Form</h2>
      {/* Add class for metadata section */}
      <div className="form-meta">
        <div> {/* Keep div structure for labels/inputs */}
          <label htmlFor="formTitle">Form Title:</label>
          <input
          type="text"
          id="formTitle"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter form title"
            required
            className="mb-2" // Add some margin bottom
          />
        </div>
        <div>
          <label htmlFor="formDescription">Description:</label>
          <textarea
          id="formDescription"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter form description (optional)"
          />
        </div>
      </div>

      <h3>Questions</h3>
      {/* QuestionEditor components will get their own internal classes */}
      {questions.map((q, index) => (
        <QuestionEditor
          key={index} // It's better to use a unique ID if available, but index is okay for now
          index={index}
          question={q}
          onQuestionChange={handleQuestionChange}
          onRemoveQuestion={handleRemoveQuestion} // Pass the remove function directly
        />
      ))}

      {/* Add class to button */}
      <button type="button" onClick={handleAddQuestion} className="mt-2">Add Question</button>

      {/* hr styling is global, no class needed */}
      <hr />

      {/* Add class to button */}
      <button onClick={handleSaveForm} className="mt-2">Save Form</button>

      {/* Apply status message classes */}
      {statusMessage && (
        <p className={`status-message ${statusMessage.startsWith('Error') ? 'error' : 'success'}`}>
          {statusMessage}
        </p>
      )}
    </div>
  );
}

export default FormBuilderPage;

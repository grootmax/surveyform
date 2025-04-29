import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getForm, submitResponse } from '../services/api'; // Import API functions

function FormFillerPage() {
  const { formId } = useParams(); // Get formId from URL
  const [form, setForm] = useState(null);
  const [answers, setAnswers] = useState({}); // Store answers as { questionIndex: answerValue }
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [submitStatus, setSubmitStatus] = useState(''); // For submission success/error messages
  const [submitted, setSubmitted] = useState(false); // Track if form has been submitted

  // Fetch form structure on component mount
  useEffect(() => {
    const fetchFormData = async () => {
      setLoading(true);
      setError('');
      setSubmitStatus('');
      setSubmitted(false);
      try {
        const formData = await getForm(formId);
        setForm(formData);
        // Initialize answers state based on fetched form questions
        const initialAnswers = formData.questions.reduce((acc, _, index) => {
          acc[index] = ''; // Default to empty string or handle based on type
          return acc;
        }, {});
        setAnswers(initialAnswers);
      } catch (err) {
        console.error("Error fetching form:", err);
        setError(err.message || `Failed to load form with ID: ${formId}. Please check the ID and try again.`);
      } finally {
        setLoading(false);
      }
    };

    fetchFormData();
  }, [formId]); // Re-fetch if formId changes

  // --- Placeholder functions ---
  const handleInputChange = (questionIndex, value) => {
    setAnswers(prevAnswers => ({
      ...prevAnswers,
      [questionIndex]: value,
    }));
    setSubmitStatus(''); // Clear status on modification
  };

  const handleCheckboxChange = (questionIndex, optionValue, isChecked) => {
     setAnswers(prevAnswers => {
        const currentSelection = prevAnswers[questionIndex] || [];
        let newSelection;
        if (isChecked) {
            newSelection = [...currentSelection, optionValue];
        } else {
            newSelection = currentSelection.filter(val => val !== optionValue);
        }
        return { ...prevAnswers, [questionIndex]: newSelection };
     });
     setSubmitStatus(''); // Clear status on modification
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submit clicked", answers);
    setSubmitStatus('Submitting...');
    setError(''); // Clear previous errors

    // Format answers for backend
    const formattedAnswers = form.questions.map((question, index) => ({
      questionText: question.questionText, // Send the original question text
      answerValue: answers[index] || '', // Get answer from state, default if needed
    }));

    try {
      // Call API service
      const responseData = { answers: formattedAnswers };
      await submitResponse(formId, responseData);
      setSubmitStatus('Success! Your response has been submitted.');
      setSubmitted(true); // Mark as submitted
      // Optionally disable inputs or redirect
    } catch (err) {
      console.error("Error submitting response:", err);
      setSubmitStatus(`Error: ${err.message || 'Failed to submit response.'}`);
      setSubmitted(false);
    }
  };
  // --- End Implemented functions ---


  // --- Render Logic ---
  if (loading) {
    // Consider adding a spinner class here later
    return <div>Loading form...</div>;
  }

  if (error) {
    // Use status message classes for error display
    return <div className="status-message error">Error: {error}</div>;
  }

  if (!form) {
    // Use status message classes for info/error display
    return <div className="status-message error">Form not found.</div>;
  }

  // Display success message using status classes
  if (submitted) {
      return (
          <div className="form-filler-page"> {/* Add page class */}
              <h2>{form.title}</h2>
              <p>{form.description}</p>
              <hr />
              {/* Use status message classes */}
              <p className="status-message success">{submitStatus}</p>
              <p>Thank you for your response!</p>
          </div>
      );
  }

  return (
    // Add page container class
    <div className="form-filler-page">
      <h2>{form.title}</h2>
      <p>{form.description}</p>
      {/* hr styling is global */}
      <hr />

      <form onSubmit={handleSubmit}>
        {form.questions.map((question, index) => (
          // Add class for each question item
          <div key={index} className="question-item">
            {/* Add class for question label */}
            <label htmlFor={`q${index}`} className="question-label">{index + 1}. {question.questionText}</label>
            {/* Render input based on questionType */}
            {question.questionType === 'text' && (
              <input
                id={`q${index}`} // Add id for label association
                type="text"
                value={answers[index] || ''}
                onChange={(e) => handleInputChange(index, e.target.value)}
                required
                // Remove inline styles, rely on App.css
                disabled={submitted}
              />
            )}
            {question.questionType === 'multiple-choice' && (
              // Remove inline style div
              <div>
                {question.options.map((option, optIndex) => (
                  <div key={optIndex} className="mb-1"> {/* Add spacing */}
                    <input
                      type="radio"
                      id={`q${index}_opt${optIndex}`}
                      name={`q${index}`}
                      value={option}
                      checked={answers[index] === option}
                      onChange={(e) => handleInputChange(index, e.target.value)}
                      required
                      disabled={submitted}
                    />
                    {/* Label styling is handled by .question-item div label */}
                    <label htmlFor={`q${index}_opt${optIndex}`}>{option}</label>
                  </div>
                ))}
              </div>
            )}
             {question.questionType === 'checkbox' && (
               // Remove inline style div
              <div>
                {question.options.map((option, optIndex) => (
                  <div key={optIndex} className="mb-1"> {/* Add spacing */}
                    <input
                      type="checkbox"
                      id={`q${index}_opt${optIndex}`}
                      value={option}
                      checked={(answers[index] || []).includes(option)}
                      onChange={(e) => handleCheckboxChange(index, option, e.target.checked)}
                      disabled={submitted}
                    />
                     {/* Label styling is handled by .question-item div label */}
                    <label htmlFor={`q${index}_opt${optIndex}`}>{option}</label>
                  </div>
                ))}
              </div>
            )}
            {question.questionType === 'dropdown' && (
               <select
                 id={`q${index}`} // Add id for label association
                 value={answers[index] || ''}
                 onChange={(e) => handleInputChange(index, e.target.value)}
                 required
                 // Remove inline styles, rely on App.css
                 disabled={submitted}
               >
                 <option value="" disabled>-- Select --</option>
                 {question.options.map((option, optIndex) => (
                    <option key={optIndex} value={option}>{option}</option>
                 ))}
               </select>
            )}
          </div>
        ))}

        {/* Add class to button */}
        <button type="submit" disabled={submitted || loading} className="mt-2">
          {submitted ? 'Submitted' : 'Submit Response'}
        </button>
        {/* Apply status message classes */}
        {submitStatus && !submitted && ( // Only show submit status if not already showing the final submitted message
             <p className={`status-message mt-2 ${submitStatus.startsWith('Error') ? 'error' : 'success'}`}>
                 {submitStatus}
             </p>
        )}
      </form>
    </div>
  );
}

export default FormFillerPage;

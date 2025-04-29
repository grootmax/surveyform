import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getForm, getResponses } from '../services/api'; // Import API functions

function FormResponsesPage() {
  const { formId } = useParams(); // Get formId from URL
  const [form, setForm] = useState(null);
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchFormAndResponses = async () => {
      setLoading(true);
      setError('');
      try {
        // Fetch form details and responses in parallel
        const [formData, responsesData] = await Promise.all([
          getForm(formId),
          getResponses(formId)
        ]);
        setForm(formData);
        setResponses(responsesData);
      } catch (err) {
        console.error("Error fetching form data or responses:", err);
        setError(err.message || `Failed to load data for form ID: ${formId}. Please check the ID and try again.`);
      } finally {
        setLoading(false);
      }
    };

    fetchFormAndResponses();
  }, [formId]); // Re-fetch if formId changes

  // Helper function to format answer values
  const formatAnswer = (answerValue) => {
    if (Array.isArray(answerValue)) {
      return answerValue.join(', '); // Join checkbox answers
    }
    // Handle potential null/undefined if needed, though backend schema expects Mixed/required
    return answerValue !== null && answerValue !== undefined ? String(answerValue) : 'N/A';
  };


  // --- Render Logic ---
  if (loading) {
    // Consider adding a spinner class here later
    return <div>Loading responses...</div>;
  }

  if (error) {
    // Use status message classes for error display
    return <div className="status-message error">Error: {error}</div>;
  }

  if (!form) {
    // Use status message classes for info/error display
    return <div className="status-message error">Form details not found. Cannot display responses.</div>;
  }

  return (
    // Add page container class
    <div className="form-responses-page">
      <h2>Responses for: {form.title}</h2>
      <p>{form.description}</p>
      {/* Optional: Link back to fill the form */}
      {/* Link styling is handled globally */}
      <p><Link to={`/form/${formId}`}>Fill out this form</Link></p>
      {/* hr styling is global */}
      <hr />

      {responses.length === 0 ? (
        <p>No responses have been submitted for this form yet.</p>
      ) : (
        <div>
          <h3>Total Responses: {responses.length}</h3>
          {responses.map((response, respIndex) => (
            // Add class for each response item
            <div key={response._id || respIndex} className="response-item">
              <h4>Response #{respIndex + 1}</h4>
              {/* Add class for submission time */}
              {response.createdAt && <p className="submission-time">Submitted on: {new Date(response.createdAt).toLocaleString()}</p>}
              <ul>
                {response.answers.map((answer, ansIndex) => (
                  // li styling is handled by .response-item ul li in CSS
                  <li key={ansIndex}>
                    <strong>{answer.questionText || `Question ${ansIndex + 1}`}:</strong> {formatAnswer(answer.answerValue)}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default FormResponsesPage;

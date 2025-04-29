import React, { useState } from 'react';
import apiClient from '../api/axiosConfig'; // Use the configured axios instance
import { useNavigate } from 'react-router-dom'; // To redirect after creation

// Define initial question structure for convenience
const initialQuestion = { type: 'text', label: '', options: [] };
// Define available question types
const questionTypes = [
    { value: 'text', label: 'Text Input' },
    { value: 'multiple_choice', label: 'Multiple Choice' },
    // Add more types here later (e.g., checkbox, dropdown)
];

function FormBuilder() {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [questions, setQuestions] = useState([{ ...initialQuestion }]); // Start with one default question
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    // --- Question Handling ---
    const handleQuestionChange = (index, field, value) => {
        const newQuestions = [...questions];
        newQuestions[index][field] = value;
        // Reset options if type changes away from multiple_choice
        if (field === 'type' && value !== 'multiple_choice') {
             newQuestions[index].options = [];
        } else if (field === 'type' && value === 'multiple_choice' && !newQuestions[index].options?.length) {
             // Add a default empty option if switching to multiple choice
             newQuestions[index].options = [''];
        }
        setQuestions(newQuestions);
    };

    const addQuestion = () => {
        setQuestions([...questions, { ...initialQuestion, type: questionTypes[0].value }]); // Add a new default question
    };

    const removeQuestion = (index) => {
        if (questions.length <= 1) return; // Keep at least one question
        const newQuestions = questions.filter((_, i) => i !== index);
        setQuestions(newQuestions);
    };

    // --- Option Handling (for Multiple Choice) ---
    const handleOptionChange = (qIndex, oIndex, value) => {
        const newQuestions = [...questions];
        newQuestions[qIndex].options[oIndex] = value;
        setQuestions(newQuestions);
    };

    const addOption = (qIndex) => {
        const newQuestions = [...questions];
        newQuestions[qIndex].options.push(''); // Add a new empty option
        setQuestions(newQuestions);
    };

    const removeOption = (qIndex, oIndex) => {
        const newQuestions = [...questions];
        if (newQuestions[qIndex].options.length <= 1) return; // Keep at least one option
        newQuestions[qIndex].options = newQuestions[qIndex].options.filter((_, i) => i !== oIndex);
        setQuestions(newQuestions);
    };

    // --- Form Submission ---
    const handleSubmit = async (event) => {
        event.preventDefault();
        setError(null); // Clear previous errors
        setIsLoading(true);

        // Basic Validation
        if (!title.trim()) {
            setError('Form title is required.');
            setIsLoading(false);
            return;
        }
        if (questions.some(q => !q.label.trim())) {
            setError('All question labels are required.');
            setIsLoading(false);
            return;
        }
         if (questions.some(q => q.type === 'multiple_choice' && q.options.some(opt => !opt.trim()))) {
            setError('All multiple choice options must have text.');
            setIsLoading(false);
            return;
        }

        const formPayload = {
            title,
            description,
            questions: questions.map(q => ({
                type: q.type,
                label: q.label.trim(),
                // Only include non-empty options for multiple choice
                options: q.type === 'multiple_choice' ? q.options.filter(opt => opt.trim()).map(opt => opt.trim()) : undefined,
            })),
        };

        try {
            const response = await apiClient.post('/forms', formPayload);
            console.log('Form created:', response.data);
            // Redirect to the new form's view page (or a success page)
            // Assuming the response contains the new form with its ID
            navigate(`/view/${response.data._id}`);
        } catch (err) {
            console.error('Error creating form:', err);
            setError(err.response?.data?.message || 'Failed to create form. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    // --- Rendering ---
    return (
        <div>
            <h2>Create New Form</h2>
            <form onSubmit={handleSubmit}>
                {/* Form Title and Description */}
                <div>
                    <label htmlFor="formTitle">Form Title:</label>
                    <input
                        type="text"
                        id="formTitle"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                        placeholder="Enter form title"
                    />
                </div>
                <div>
                    <label htmlFor="formDescription">Description:</label>
                    <textarea
                        id="formDescription"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Optional: Enter form description"
                    />
                </div>

                <hr />

                {/* Questions Section */}
                <h3>Questions</h3>
                {questions.map((question, qIndex) => (
                    <div key={qIndex} style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '10px' }}>
                        <h4>Question {qIndex + 1}</h4>
                        {/* Question Type Selector */}
                        <div>
                            <label htmlFor={`qType-${qIndex}`}>Type:</label>
                            <select
                                id={`qType-${qIndex}`}
                                value={question.type}
                                onChange={(e) => handleQuestionChange(qIndex, 'type', e.target.value)}
                            >
                                {questionTypes.map(type => (
                                    <option key={type.value} value={type.value}>{type.label}</option>
                                ))}
                            </select>
                        </div>

                        {/* Question Label Input */}
                        <div>
                            <label htmlFor={`qLabel-${qIndex}`}>Label:</label>
                            <input
                                type="text"
                                id={`qLabel-${qIndex}`}
                                value={question.label}
                                onChange={(e) => handleQuestionChange(qIndex, 'label', e.target.value)}
                                required
                                placeholder="Enter question text"
                            />
                        </div>

                        {/* Options for Multiple Choice */}
                        {question.type === 'multiple_choice' && (
                            <div>
                                <h5>Options:</h5>
                                {question.options.map((option, oIndex) => (
                                    <div key={oIndex} style={{ display: 'flex', alignItems: 'center', marginBottom: '5px' }}>
                                        <input
                                            type="text"
                                            value={option}
                                            onChange={(e) => handleOptionChange(qIndex, oIndex, e.target.value)}
                                            placeholder={`Option ${oIndex + 1}`}
                                            required
                                        />
                                        <button type="button" onClick={() => removeOption(qIndex, oIndex)} disabled={question.options.length <= 1}>
                                            Remove Option
                                        </button>
                                    </div>
                                ))}
                                <button type="button" onClick={() => addOption(qIndex)}>
                                    Add Option
                                </button>
                            </div>
                        )}

                        {/* Remove Question Button */}
                        <button type="button" onClick={() => removeQuestion(qIndex)} disabled={questions.length <= 1}>
                            Remove Question {qIndex + 1}
                        </button>
                        <hr style={{ margin: '15px 0' }}/>
                    </div>
                ))}

                {/* Add Question Button */}
                <button type="button" onClick={addQuestion}>
                    Add Another Question
                </button>

                <hr />

                {/* Submission Area */}
                {error && <p style={{ color: 'red' }}>Error: {error}</p>}
                <button type="submit" disabled={isLoading}>
                    {isLoading ? 'Creating Form...' : 'Create Form'}
                </button>
            </form>
        </div>
    );
}

export default FormBuilder;

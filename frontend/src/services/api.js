import axios from 'axios';

// Create an Axios instance
const apiClient = axios.create({
  // Use environment variable for base URL in a real app
  // baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  baseURL: '/api', // Using relative path for proxy (if set up in vite.config.js) or same origin
  headers: {
    'Content-Type': 'application/json',
  },
});

// Function to create a new form
export const createForm = async (formData) => {
  try {
    const response = await apiClient.post('/forms', formData);
    return response.data; // Return the created form data
  } catch (error) {
    console.error('Error creating form:', error.response ? error.response.data : error.message);
    // Re-throw the error or return a specific error object
    throw error.response ? error.response.data : new Error('API request failed');
  }
};

// Function to get responses for a specific form
export const getResponses = async (formId) => {
  try {
    // The backend route is /api/forms/:formId/responses
    const response = await apiClient.get(`/forms/${formId}/responses`);
    return response.data; // Return the array of responses
  } catch (error) {
    console.error(`Error fetching responses for form ${formId}:`, error.response ? error.response.data : error.message);
    throw error.response ? error.response.data : new Error('API request failed');
  }
};

// Function to get a specific form by ID
export const getForm = async (formId) => {
  try {
    const response = await apiClient.get(`/forms/${formId}`);
    return response.data; // Return the form data
  } catch (error) {
    console.error(`Error fetching form ${formId}:`, error.response ? error.response.data : error.message);
    throw error.response ? error.response.data : new Error('API request failed');
  }
};

// Function to submit a response for a specific form
export const submitResponse = async (formId, responseData) => {
  try {
    // The backend route is /api/forms/:formId/responses
    const response = await apiClient.post(`/forms/${formId}/responses`, responseData);
    return response.data; // Return the saved response data
  } catch (error) {
    console.error(`Error submitting response for form ${formId}:`, error.response ? error.response.data : error.message);
    throw error.response ? error.response.data : new Error('API request failed');
  }
};


export default apiClient; // Export the instance for potential direct use elsewhere

import axios from 'axios';

// Configure a base URL for backend requests
// Adjust the baseURL if your backend runs on a different port or domain
const instance = axios.create({
  baseURL: 'http://localhost:5001/api', // Match backend port from .env
  timeout: 5000, // Optional: Set a request timeout
  headers: {
    'Content-Type': 'application/json',
  }
});

export default instance;

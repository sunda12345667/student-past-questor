
import axios from 'axios';

// REPLACE: When deploying to production, set this to your actual API URL in your environment variables
// For development, this points to your local server
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create an axios instance with error handling
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  // Add a timeout to prevent hanging requests
  timeout: 15000,
});

// Add a request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('API request error:', error);
    return Promise.reject(error);
  }
);

// Add a response interceptor for global error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle network errors
    if (!error.response) {
      console.error('Network error or server not responding');
      // You can add toast notification here if needed
    } 
    // Handle specific HTTP errors
    else {
      const status = error.response.status;
      
      if (status === 401) {
        console.error('Authentication failed or token expired');
        // You might want to redirect to login here
        // Or refresh the token if you have refresh token logic
      } else if (status === 403) {
        console.error('Forbidden - No permission to access this resource');
      } else if (status === 404) {
        console.error('Resource not found');
      } else if (status >= 500) {
        console.error('Server error');
      }
    }
    
    return Promise.reject(error);
  }
);

export default api;

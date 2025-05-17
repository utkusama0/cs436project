// axios configuration and interceptors
import axios from 'axios';

// Create axios instance with default config
const axiosInstance = axios.create({
  headers: {
    'Content-Type': 'application/json',
  },
  // Ensure credentials are included in requests when needed
  withCredentials: false
});

// Request interceptor
axiosInstance.interceptors.request.use(
  config => {
    // You can modify the request config here before it's sent
    // For example, add authentication tokens if needed
    
    // Log requests in development
    if (import.meta.env.DEV) {
      console.log('API Request:', config.method.toUpperCase(), config.url);
    }
    
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  response => {
    // Handle successful responses
    return response;
  },
  error => {
    // Handle errors globally
    if (error.response) {
      // The request was made and the server responded with a status outside the 2xx range
      console.error('API Error Response:', {
        status: error.response.status,
        data: error.response.data,
        headers: error.response.headers
      });
      
      // Handle specific error status codes
      switch (error.response.status) {
        case 401:
          // Handle unauthorized errors
          console.error('Unauthorized access');
          break;
          
        case 403:
          // Handle forbidden errors
          console.error('Forbidden access');
          break;
          
        case 404:
          // Handle not found errors
          console.error('Resource not found');
          break;
          
        case 500:
          // Handle server errors
          console.error('Server error');
          break;
          
        default:
          // Handle other errors
          break;
      }
    } else if (error.request) {
      // The request was made but no response was received
      console.error('No response received:', error.request);
    } else {
      // Something happened in setting up the request
      console.error('Request setup error:', error.message);
    }
    
    return Promise.reject(error);
  }
);

// Export as default to match axios import in services
export default axiosInstance;

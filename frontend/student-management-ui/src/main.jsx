// src/main.jsx
import React from 'react';
import { StrictMode } from 'react';
import { createRoot }   from 'react-dom/client';
import axios from 'axios';

// Debug: Log that the main module is loading
console.log('Main module loading');

// Configure axios to use the same protocol as the current page
axios.defaults.baseURL = '';

// Add both request and response interceptors for comprehensive HTTPS enforcement
axios.interceptors.request.use((config) => {
  // Ensure API calls use HTTPS protocol for production
  if (config.url && config.url.startsWith('/api')) {
    // Force HTTPS for all API calls in production
    const protocol = window.location.hostname === 'localhost' ? window.location.protocol : 'https:';
    config.url = `${protocol}//${window.location.host}${config.url}`;
    
    // Log for debugging
    console.log(`API call intercepted: ${config.url}`);
  }
  
  // Additional safety: convert any http:// URLs to https:// in production
  if (config.url && config.url.startsWith('http://') && window.location.hostname !== 'localhost') {
    config.url = config.url.replace('http://', 'https://');
    console.log(`Converted HTTP to HTTPS: ${config.url}`);
  }
  
  return config;
});

// Response interceptor to catch any remaining HTTP issues
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.message && error.message.includes('Mixed Content')) {
      console.error('Mixed Content Error detected:', error);
      // Optionally reload with HTTPS
      if (window.location.protocol === 'http:' && window.location.hostname !== 'localhost') {
        window.location.protocol = 'https:';
      }
    }
    return Promise.reject(error);
  }
);

// 1) Bootstrap styles
import 'bootstrap/dist/css/bootstrap.min.css';
// 2) Your own global CSS
import './index.css';
// 3) The App component
import App from './App.jsx';

// Debug: Add error handling around React mount
try {
  console.log('Attempting to mount React app');
  const rootElement = document.getElementById('root');
  console.log('Root element found:', rootElement);
  
  const root = createRoot(rootElement);
  console.log('Root created successfully');
  
  root.render(
    <StrictMode>
      <App />
    </StrictMode>
  );
  console.log('Render called successfully');
} catch (error) {
  console.error('Error mounting React app:', error);
  
  // Create a visible error message
  const errorDiv = document.createElement('div');
  errorDiv.style.color = 'red';
  errorDiv.style.padding = '20px';
  errorDiv.style.margin = '20px';
  errorDiv.style.border = '1px solid red';
  errorDiv.textContent = `React mount error: ${error.message}`;
  document.body.appendChild(errorDiv);
}

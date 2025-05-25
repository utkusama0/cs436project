// src/main.jsx
import React from 'react';
import { StrictMode } from 'react';
import { createRoot }   from 'react-dom/client';
import axios from 'axios';

// Debug: Log that the main module is loading
console.log('Main module loading');

// Configure axios to use the same protocol as the current page
axios.defaults.baseURL = '';
axios.interceptors.request.use((config) => {
  // Ensure API calls use the same protocol as the page
  if (config.url && config.url.startsWith('/api')) {
    config.url = `${window.location.protocol}//${window.location.host}${config.url}`;
  }
  return config;
});

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

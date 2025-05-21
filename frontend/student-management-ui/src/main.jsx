// src/main.jsx
import React from 'react';
import { StrictMode } from 'react';
import { createRoot }   from 'react-dom/client';

// 1) Bootstrap styles
import 'bootstrap/dist/css/bootstrap.min.css';
// 2) Your own global CSS
import './index.css';
// 3) The App component
import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);

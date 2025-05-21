import React from 'react';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

// 1) Import Bootstrap’s CSS so React-Bootstrap components render correctly
import 'bootstrap/dist/css/bootstrap.min.css';

// 2) Your global styles
import './index.css';

// 3) The root app
import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);

import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import 'govuk-frontend/dist/govuk/govuk-frontend.min.css';
import './print.css';
import { initAll } from 'govuk-frontend';
import App from './App';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);

// Initialise GOV.UK component JS (button double-click guard, etc.) after render.
initAll();

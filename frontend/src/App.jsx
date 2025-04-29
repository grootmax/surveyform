import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import FormBuilderPage from './pages/FormBuilderPage';
import FormFillerPage from './pages/FormFillerPage'; // Import the FormFillerPage
import './App.css';

function App() {
  return (
    <Router>
      {/* Add main App container class */}
      <div className="App">
        {/* Optional: Simple Navigation */}
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/create-form">Create New Form</Link>
            </li>
            {/* Example link to responses for a known form ID (replace with dynamic links later) */}
            <li>
              <Link to="/forms/YOUR_FORM_ID_HERE/responses">View Responses (Example)</Link>
            </li>
          </ul>
        </nav>

        {/* hr styling is global in App.css, no class needed unless specific styling is desired */}
        <hr />

        {/* Define Routes */}
        <Routes>
          {/* Route for the Form Builder */}
          <Route path="/create-form" element={<FormBuilderPage />} />

          {/* Route for Filling a Form */}
          <Route path="/form/:formId" element={<FormFillerPage />} />

          {/* Route for Viewing Responses */}
          <Route path="/forms/:formId/responses" element={<FormResponsesPage />} />

          {/* Optional: Simple Home Page Route */}
          <Route path="/" element={
            <div>
              <h2>Welcome to the Form Builder</h2>
              <p>Select "Create New Form" to get started.</p>
            </div>
          } />

          {/* Add other routes here */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;

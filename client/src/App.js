import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import FormBuilder from './components/FormBuilder';
import FormViewer from './components/FormViewer';
import ResponseViewer from './components/ResponseViewer';
// import './App.css'; // Assuming default CRA styling - will create later if needed

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/create" element={<FormBuilder />} />
          <Route path="/view/:formId" element={<FormViewer />} />
          <Route path="/responses/:formId" element={<ResponseViewer />} />
          {/* Add other routes as needed */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;

import React from 'react';
import ReactDOM from 'react-dom/client';
// import './index.css'; // Assuming default CRA styling - will create later if needed
import App from './App';
import reportWebVitals from './reportWebVitals'; // Assuming this file exists from CRA setup

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// We'll assume reportWebVitals exists or is not strictly needed for this step
if (typeof reportWebVitals === 'function') {
  reportWebVitals();
}

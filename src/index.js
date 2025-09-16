import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/global.css';
// import './styles/bootstrap.min.css';
import './styles/toastr-theme.css';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux'; 
import store from './store'; 
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import App from './App.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <Router>
        <Routes>
          {/* Passes all nested sub-paths cleanly over to App.jsx to match screens */}
          <Route path='/*' element={<App />} />
        </Routes>
      </Router>
    </Provider>
  </React.StrictMode>
);
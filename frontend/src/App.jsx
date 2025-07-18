import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import AdminDashboard from './pages/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <Router>
      <Routes>
        <Route 
          path="/login" 
          element={<LoginPage setIsAuthenticated={setIsAuthenticated} />} 
        />
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <AdminDashboard setIsAuthenticated={setIsAuthenticated} />
            </ProtectedRoute>
          } 
        />
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
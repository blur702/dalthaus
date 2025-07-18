import React from 'react';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = ({ setIsAuthenticated }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    setIsAuthenticated(false);
    navigate('/login');
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Admin Dashboard</h1>
        <button onClick={handleLogout} className="logout-button">Logout</button>
      </div>
      <p>Welcome to the admin area!</p>
    </div>
  );
};

export default AdminDashboard;
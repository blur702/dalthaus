import React from 'react';
import { useNavigate } from 'react-router-dom';
import CreateUserForm from '../components/CreateUserForm';

const AdminDashboard = ({ setIsAuthenticated }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear token from storage on logout
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    navigate('/login');
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Admin Dashboard</h1>
        <button onClick={handleLogout} className="logout-button">Logout</button>
      </div>
      <p>Welcome to the admin area! From here you can manage the application.</p>
      
      <hr />

      {/* Add the user creation form here */}
      <CreateUserForm />
    </div>
  );
};

export default AdminDashboard;
import React from 'react';
import AdminLayout from '../components/AdminLayout';

const AdminDashboard = ({ setIsAuthenticated }) => {
  return (
    <AdminLayout setIsAuthenticated={setIsAuthenticated}>
      <div className="dashboard-content">
        <div className="page-header">
          <h2>Dashboard</h2>
          <p>Welcome to the admin area! From here you can manage the application.</p>
        </div>
        
        <div className="dashboard-cards">
          <div className="dashboard-card">
            <h3>Users</h3>
            <p className="card-value">5</p>
            <p className="card-label">Total Users</p>
          </div>
          
          <div className="dashboard-card">
            <h3>Activity</h3>
            <p className="card-value">24</p>
            <p className="card-label">Actions Today</p>
          </div>
          
          <div className="dashboard-card">
            <h3>System Status</h3>
            <p className="card-value status-active">Active</p>
            <p className="card-label">All Systems Operational</p>
          </div>
        </div>
        
        <div className="recent-activity">
          <h3>Recent Activity</h3>
          <ul className="activity-list">
            <li className="activity-item">
              <span className="activity-user">Admin</span>
              <span className="activity-action">logged in</span>
              <span className="activity-time">2 minutes ago</span>
            </li>
            <li className="activity-item">
              <span className="activity-user">System</span>
              <span className="activity-action">backup completed</span>
              <span className="activity-time">1 hour ago</span>
            </li>
          </ul>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
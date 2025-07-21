import React, { useState, useEffect, useRef } from 'react';
import AdminLayout from '../../../components/AdminLayout';
import UserList from '../components/UserList';
import UserModal from '../components/UserModal';
import userService from '../services/userService';

const UserManagement = ({ setIsAuthenticated }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const timeoutRef = useRef(null);

  useEffect(() => {
    loadUsers();
    
    // Cleanup function
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await userService.getUsers();
      setUsers(data.users || []);
    } catch (err) {
      setError(err.message || 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setSelectedUser(null);
    setModalOpen(true);
  };

  const handleEdit = (user) => {
    setSelectedUser(user);
    setModalOpen(true);
  };

  const handleDelete = (user) => {
    setDeleteConfirm(user);
  };

  const confirmDelete = async () => {
    if (!deleteConfirm) return;

    try {
      await userService.deleteUser(deleteConfirm.id);
      setSuccessMessage(`User ${deleteConfirm.username} deleted successfully`);
      setDeleteConfirm(null);
      loadUsers();
      timeoutRef.current = setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setError(err.message || 'Failed to delete user');
    }
  };

  const handleSave = async (userData) => {
    try {
      if (selectedUser) {
        // Update existing user
        await userService.updateUser(selectedUser.id, userData);
        setSuccessMessage('User updated successfully');
      } else {
        // Create new user
        await userService.createUser(userData);
        setSuccessMessage('User created successfully');
      }
      
      setModalOpen(false);
      loadUsers();
      timeoutRef.current = setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setError(err.message || 'Failed to save user');
    }
  };

  return (
    <AdminLayout setIsAuthenticated={setIsAuthenticated}>
      <div className="user-management">
        <div className="page-header">
          <h2>User Management</h2>
          <button className="btn-primary" onClick={handleCreate}>
            Create New User
          </button>
        </div>

        {error && (
          <div className="alert alert-error">
            {error}
            <button 
              className="alert-close" 
              onClick={() => setError('')}
            >
              &times;
            </button>
          </div>
        )}

        {successMessage && (
          <div className="alert alert-success">
            {successMessage}
          </div>
        )}

        <div className="user-management-content">
          <UserList 
            users={users}
            onEdit={handleEdit}
            onDelete={handleDelete}
            loading={loading}
          />
        </div>

        <UserModal
          user={selectedUser}
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          onSave={handleSave}
        />

        {deleteConfirm && (
          <div className="modal-overlay" onClick={() => setDeleteConfirm(null)}>
            <div className="modal-content confirm-dialog" onClick={e => e.stopPropagation()}>
              <h3>Confirm Delete</h3>
              <p>Are you sure you want to delete user <strong>{deleteConfirm.username}</strong>?</p>
              <p className="warning">This action cannot be undone.</p>
              <div className="modal-actions">
                <button 
                  className="btn-cancel" 
                  onClick={() => setDeleteConfirm(null)}
                >
                  Cancel
                </button>
                <button 
                  className="btn-delete" 
                  onClick={confirmDelete}
                >
                  Delete User
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default UserManagement;
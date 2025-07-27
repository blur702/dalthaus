import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Alert,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Stack
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
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
      <Container maxWidth="lg">
        <Box sx={{ py: 3 }}>
          <Stack 
            direction="row" 
            justifyContent="space-between" 
            alignItems="center" 
            sx={{ mb: 3 }}
          >
            <Typography variant="h4" component="h2">
              User Management
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleCreate}
            >
              Create New User
            </Button>
          </Stack>

          {error && (
            <Alert 
              severity="error" 
              onClose={() => setError('')}
              sx={{ mb: 2 }}
            >
              {error}
            </Alert>
          )}

          <Snackbar
            open={!!successMessage}
            autoHideDuration={3000}
            onClose={() => setSuccessMessage('')}
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          >
            <Alert onClose={() => setSuccessMessage('')} severity="success">
              {successMessage}
            </Alert>
          </Snackbar>

          <UserList 
            users={users}
            onEdit={handleEdit}
            onDelete={handleDelete}
            loading={loading}
          />

          <UserModal
            user={selectedUser}
            isOpen={modalOpen}
            onClose={() => setModalOpen(false)}
            onSave={handleSave}
          />

          <Dialog
            open={!!deleteConfirm}
            onClose={() => setDeleteConfirm(null)}
          >
            <DialogTitle>Confirm Delete</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Are you sure you want to delete user <strong>{deleteConfirm?.username}</strong>?
              </DialogContentText>
              <Alert severity="warning" sx={{ mt: 2 }}>
                This action cannot be undone.
              </Alert>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setDeleteConfirm(null)}>
                Cancel
              </Button>
              <Button 
                onClick={confirmDelete} 
                color="error" 
                variant="contained"
              >
                Delete User
              </Button>
            </DialogActions>
          </Dialog>
        </Box>
      </Container>
    </AdminLayout>
  );
};

export default UserManagement;
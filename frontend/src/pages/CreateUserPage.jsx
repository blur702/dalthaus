import React from 'react';
import { Box, Typography } from '@mui/material';
import AdminLayout from '../components/AdminLayout';
import CreateUserForm from '../modules/users/components/CreateUserForm';

const CreateUserPage = ({ setIsAuthenticated }) => {
  return (
    <AdminLayout setIsAuthenticated={setIsAuthenticated}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h2" gutterBottom>
          Create New User
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Add a new admin user to the system
        </Typography>
      </Box>
      <CreateUserForm />
    </AdminLayout>
  );
};

export default CreateUserPage;
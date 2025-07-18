import React from 'react';
import AdminLayout from '../components/AdminLayout';
import CreateUserForm from '../components/CreateUserForm';

const CreateUserPage = ({ setIsAuthenticated }) => {
  return (
    <AdminLayout setIsAuthenticated={setIsAuthenticated}>
      <div className="page-header">
        <h2>Create New User</h2>
        <p>Add a new admin user to the system</p>
      </div>
      <CreateUserForm />
    </AdminLayout>
  );
};

export default CreateUserPage;
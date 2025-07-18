import React, { useState } from 'react';
import api from '../../../services/api';

const CreateUserForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleCreateUser = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      const response = await api.post('/users', { username, password });
      setMessage(`Successfully created user: ${response.data.user.username}`);
      setUsername('');
      setPassword('');
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Failed to create user.';
      setError(errorMessage);
    }
  };

  return (
    <div className="create-user-card">
      <h3>Create New Admin User</h3>
      <form onSubmit={handleCreateUser}>
        <div className="form-group">
          <label htmlFor="new-username">Username</label>
          <input
            type="text"
            id="new-username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="new-password">Password</label>
          <input
            type="password"
            id="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="submit-button">Create User</button>
        {message && <p className="success-message">{message}</p>}
        {error && <p className="error-message">{error}</p>}
      </form>
    </div>
  );
};

export default CreateUserForm;
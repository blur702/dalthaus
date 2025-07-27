import React, { useState } from 'react';
import {
  Card,
  CardContent,
  TextField,
  Button,
  Alert,
  Box,
  Typography,
  CircularProgress
} from '@mui/material';
import { styled } from '@mui/material/styles';
import api from '../../../services/api';

const StyledCard = styled(Card)(({ theme }) => ({
  maxWidth: 600,
  margin: '0 auto',
}));

const StyledForm = styled('form')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
}));

const CreateUserForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCreateUser = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setLoading(true);

    try {
      const response = await api.post('/users', { username, password });
      setMessage(`Successfully created user: ${response.data.user.username}`);
      setUsername('');
      setPassword('');
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Failed to create user.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <StyledCard>
      <CardContent>
        <Typography variant="h5" component="h3" gutterBottom>
          Create New Admin User
        </Typography>
        <StyledForm onSubmit={handleCreateUser}>
          <TextField
            label="Username"
            variant="outlined"
            fullWidth
            id="new-username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            disabled={loading}
          />
          <TextField
            label="Password"
            variant="outlined"
            fullWidth
            type="password"
            id="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            size="large"
            disabled={loading}
            sx={{ mt: 2 }}
          >
            {loading ? <CircularProgress size={24} /> : 'Create User'}
          </Button>
          {message && (
            <Alert severity="success" sx={{ mt: 2 }}>
              {message}
            </Alert>
          )}
          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}
        </StyledForm>
      </CardContent>
    </StyledCard>
  );
};

export default CreateUserForm;
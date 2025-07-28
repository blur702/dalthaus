import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Snackbar,
  Alert,
  CircularProgress,
  Breadcrumbs,
  Link,
} from '@mui/material';
import { Save as SaveIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../../components/AdminLayout';
import GlobalSettingsEditor from '../templates/components/GlobalSettingsEditor';
import api from '../../services/api';

const GlobalSettings = ({ setIsAuthenticated }) => {
  const navigate = useNavigate();
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Load global settings
  useEffect(() => {
    loadGlobalSettings();
  }, []);

  const loadGlobalSettings = async () => {
    try {
      setLoading(true);
      const response = await api.get('/settings/global');
      if (response.data.success) {
        setSettings(response.data.settings || {});
      }
    } catch (error) {
      console.error('Error loading global settings:', error);
      setSnackbar({
        open: true,
        message: 'Failed to load global settings',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSettingsChange = (updatedSettings) => {
    setSettings(updatedSettings);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await api.put('/settings/global', {
        settings: settings
      });
      
      if (response.data.success) {
        setSnackbar({
          open: true,
          message: 'Global settings saved successfully',
          severity: 'success'
        });
      }
    } catch (error) {
      console.error('Error saving global settings:', error);
      setSnackbar({
        open: true,
        message: error.response?.data?.message || 'Failed to save global settings',
        severity: 'error'
      });
    } finally {
      setSaving(false);
    }
  };

  const handleReset = async () => {
    if (window.confirm('Are you sure you want to reset to default settings? This cannot be undone.')) {
      try {
        const response = await api.post('/settings/global/reset');
        if (response.data.success) {
          setSettings(response.data.settings || {});
          setSnackbar({
            open: true,
            message: 'Settings reset to defaults',
            severity: 'info'
          });
        }
      } catch (error) {
        setSnackbar({
          open: true,
          message: 'Failed to reset settings',
          severity: 'error'
        });
      }
    }
  };

  return (
    <AdminLayout setIsAuthenticated={setIsAuthenticated}>
      <Box sx={{ p: 3 }}>
        {/* Breadcrumbs */}
        <Breadcrumbs sx={{ mb: 3 }}>
          <Link
            component="button"
            variant="body1"
            onClick={() => navigate('/admin')}
            sx={{ textDecoration: 'none' }}
          >
            Dashboard
          </Link>
          <Link
            component="button"
            variant="body1"
            onClick={() => navigate('/admin/settings')}
            sx={{ textDecoration: 'none' }}
          >
            Settings
          </Link>
          <Typography color="text.primary">Global Settings</Typography>
        </Breadcrumbs>

        {/* Header */}
        <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="h4" gutterBottom>
              Global Settings
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Configure default typography, colors, and spacing that apply across all templates
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="outlined"
              onClick={handleReset}
              disabled={loading || saving}
            >
              Reset to Defaults
            </Button>
            <Button
              variant="contained"
              color="primary"
              startIcon={<SaveIcon />}
              onClick={handleSave}
              disabled={loading || saving}
            >
              {saving ? 'Saving...' : 'Save Settings'}
            </Button>
          </Box>
        </Box>

        {/* Main Content */}
        {loading ? (
          <Paper sx={{ p: 4, textAlign: 'center' }}>
            <CircularProgress />
            <Typography sx={{ mt: 2 }}>Loading settings...</Typography>
          </Paper>
        ) : (
          <Paper elevation={2} sx={{ overflow: 'hidden' }}>
            <GlobalSettingsEditor
              templateData={settings}
              onTemplateChange={handleSettingsChange}
            />
          </Paper>
        )}

        {/* Info Box */}
        <Paper sx={{ p: 3, mt: 3, backgroundColor: 'info.lighter' }}>
          <Typography variant="h6" gutterBottom>
            About Global Settings
          </Typography>
          <Typography variant="body2" paragraph>
            Global settings serve as the default values for all templates in your system. When creating a new template,
            these settings will be used as the starting point.
          </Typography>
          <Typography variant="body2" paragraph>
            Templates can override any of these settings individually. Changes made here will not affect existing
            templates, only new templates created after saving these settings.
          </Typography>
          <Typography variant="body2">
            <strong>Tip:</strong> Set up your brand colors, typography, and spacing here to ensure consistency
            across all new templates.
          </Typography>
        </Paper>

        {/* Snackbar */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <Alert 
            onClose={() => setSnackbar({ ...snackbar, open: false })} 
            severity={snackbar.severity}
            sx={{ width: '100%' }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </AdminLayout>
  );
};

export default GlobalSettings;
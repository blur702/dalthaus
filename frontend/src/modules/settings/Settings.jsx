import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Alert,
  Snackbar,
  Paper,
  Divider,
  CircularProgress,
  IconButton,
  Chip,
  FormHelperText,
  Switch,
  FormControlLabel
} from '@mui/material';
import { styled } from '@mui/material/styles';
import CloseIcon from '@mui/icons-material/Close';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import AdminLayout from '../../components/AdminLayout';
import api from '../../services/api';

const SettingsCard = styled(Card)(({ theme, current }) => ({
  height: '100%',
  cursor: 'pointer',
  transition: 'all 0.2s',
  border: current ? `2px solid ${theme.palette.primary.main}` : '1px solid #e0e0e0',
  backgroundColor: current ? theme.palette.primary.light + '10' : 'white',
  '&:hover': {
    boxShadow: theme.shadows[4],
    transform: 'translateY(-2px)',
  },
}));

const CardIcon = styled(Box)(({ theme }) => ({
  fontSize: '32px',
  marginBottom: theme.spacing(2),
}));

const FormSection = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(4),
  paddingBottom: theme.spacing(3),
  borderBottom: `1px solid ${theme.palette.divider}`,
  '&:last-child': {
    borderBottom: 'none',
    marginBottom: theme.spacing(3),
  },
}));

const Settings = ({ setIsAuthenticated }) => {
  const [settings, setSettings] = useState({
    siteName: '',
    siteDescription: '',
    faviconUrl: '',
    metaKeywords: '',
    metaAuthor: '',
    contactEmail: '',
    copyrightText: '',
    googleAnalyticsId: '',
    timezone: 'America/New_York'
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const response = await api.get('/settings/site');
      if (response.data) {
        setSettings(response.data);
      }
    } catch (err) {
      if (err.response?.status !== 404) {
        setError('Failed to load settings');
      }
      // If 404, use default values
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccessMessage('');

    try {
      await api.put('/settings/site', settings);
      setSuccessMessage('Settings saved successfully');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const settingsCategories = [
    {
      id: 'site',
      title: 'Site Settings',
      description: 'General site configuration including name, description, and metadata',
      icon: '🌐',
      link: null,
      current: true
    },
    {
      id: 'tinymce',
      title: 'TinyMCE Editor',
      description: 'Configure rich text editor profiles and settings',
      icon: '📝',
      link: '/admin/settings/tinymce'
    },
    {
      id: 'users',
      title: 'User Settings',
      description: 'Default user roles, permissions, and authentication settings',
      icon: '👥',
      link: '/admin/settings/users',
      comingSoon: true
    },
    {
      id: 'email',
      title: 'Email Configuration',
      description: 'SMTP settings and email templates',
      icon: '📧',
      link: '/admin/settings/email',
      comingSoon: true
    }
  ];

  if (loading) {
    return (
      <AdminLayout setIsAuthenticated={setIsAuthenticated}>
        <Container maxWidth="lg">
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
            <CircularProgress />
          </Box>
        </Container>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout setIsAuthenticated={setIsAuthenticated}>
      <Container maxWidth="lg">
        <Box sx={{ py: 3 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Settings
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            Manage your site configuration and preferences
          </Typography>

          {error && (
            <Alert 
              severity="error" 
              action={
                <IconButton
                  aria-label="close"
                  color="inherit"
                  size="small"
                  onClick={() => setError('')}
                >
                  <CloseIcon fontSize="inherit" />
                </IconButton>
              }
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

          <Grid container spacing={3} sx={{ mb: 4 }}>
            {settingsCategories.map(category => (
              <Grid item xs={12} sm={6} md={3} key={category.id}>
                <SettingsCard current={category.current}>
                  <CardContent>
                    <CardIcon>{category.icon}</CardIcon>
                    <Typography variant="h6" component="h3" gutterBottom>
                      {category.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" paragraph>
                      {category.description}
                    </Typography>
                    {category.link && !category.comingSoon && (
                      <Button
                        component={Link}
                        to={category.link}
                        endIcon={<ArrowForwardIcon />}
                        size="small"
                      >
                        Configure
                      </Button>
                    )}
                    {category.comingSoon && (
                      <Chip label="Coming Soon" size="small" />
                    )}
                    {category.current && (
                      <Chip label="Current Page" color="primary" size="small" />
                    )}
                  </CardContent>
                </SettingsCard>
              </Grid>
            ))}
          </Grid>

          <Paper elevation={1} sx={{ p: 3 }}>
            <Typography variant="h5" component="h2" gutterBottom>
              Site Configuration
            </Typography>
            
            <Box component="form" onSubmit={handleSubmit}>
              <FormSection>
                <Typography variant="h6" component="h3" gutterBottom>
                  Basic Information
                </Typography>
                
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <TextField
                      label="Site Name"
                      name="siteName"
                      value={settings.siteName}
                      onChange={handleChange}
                      placeholder="My Awesome Site"
                      required
                      fullWidth
                      helperText="The name of your website displayed in the browser title"
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      label="Site Description"
                      name="siteDescription"
                      value={settings.siteDescription}
                      onChange={handleChange}
                      multiline
                      rows={3}
                      placeholder="A brief description of your website"
                      fullWidth
                      helperText="Used in meta descriptions and site overviews"
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      label="Favicon URL"
                      name="faviconUrl"
                      type="url"
                      value={settings.faviconUrl}
                      onChange={handleChange}
                      placeholder="https://example.com/favicon.ico"
                      fullWidth
                      helperText="URL to your site's favicon (16x16 or 32x32 pixels)"
                    />
                  </Grid>
                </Grid>
              </FormSection>

              <FormSection>
                <Typography variant="h6" component="h3" gutterBottom>
                  SEO & Metadata
                </Typography>
                
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      label="Meta Keywords"
                      name="metaKeywords"
                      value={settings.metaKeywords}
                      onChange={handleChange}
                      placeholder="keyword1, keyword2, keyword3"
                      fullWidth
                      helperText="Comma-separated keywords for search engines"
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <TextField
                      label="Meta Author"
                      name="metaAuthor"
                      value={settings.metaAuthor}
                      onChange={handleChange}
                      placeholder="John Doe"
                      fullWidth
                      helperText="Default author name for content"
                    />
                  </Grid>
                </Grid>
              </FormSection>

              <FormSection>
                <Typography variant="h6" component="h3" gutterBottom>
                  Contact & Legal
                </Typography>
                
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      label="Contact Email"
                      name="contactEmail"
                      type="email"
                      value={settings.contactEmail}
                      onChange={handleChange}
                      placeholder="contact@example.com"
                      fullWidth
                      helperText="Primary contact email for the site"
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <TextField
                      label="Copyright Text"
                      name="copyrightText"
                      value={settings.copyrightText}
                      onChange={handleChange}
                      placeholder="© 2024 My Company. All rights reserved."
                      fullWidth
                      helperText="Copyright notice displayed in the footer"
                    />
                  </Grid>
                </Grid>
              </FormSection>

              <FormSection>
                <Typography variant="h6" component="h3" gutterBottom>
                  Analytics & Tracking
                </Typography>
                
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      label="Google Analytics ID"
                      name="googleAnalyticsId"
                      value={settings.googleAnalyticsId}
                      onChange={handleChange}
                      placeholder="G-XXXXXXXXXX"
                      fullWidth
                      helperText="Google Analytics tracking ID"
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth>
                      <InputLabel>Timezone</InputLabel>
                      <Select
                        name="timezone"
                        value={settings.timezone}
                        onChange={handleChange}
                        label="Timezone"
                      >
                        <MenuItem value="America/New_York">Eastern Time (US)</MenuItem>
                        <MenuItem value="America/Chicago">Central Time (US)</MenuItem>
                        <MenuItem value="America/Denver">Mountain Time (US)</MenuItem>
                        <MenuItem value="America/Los_Angeles">Pacific Time (US)</MenuItem>
                        <MenuItem value="Europe/London">London (UK)</MenuItem>
                        <MenuItem value="Europe/Paris">Paris (France)</MenuItem>
                        <MenuItem value="Asia/Tokyo">Tokyo (Japan)</MenuItem>
                        <MenuItem value="Australia/Sydney">Sydney (Australia)</MenuItem>
                      </Select>
                      <FormHelperText>Default timezone for the site</FormHelperText>
                    </FormControl>
                  </Grid>
                </Grid>
              </FormSection>

              <FormSection>
                <Typography variant="h6" component="h3" gutterBottom>
                  Maintenance Mode
                </Typography>
                
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <FormControlLabel
                      control={
                        <Switch
                          name="maintenanceMode"
                          checked={settings.maintenanceMode || false}
                          onChange={(e) => setSettings(prev => ({
                            ...prev,
                            maintenanceMode: e.target.checked
                          }))}
                          color="primary"
                        />
                      }
                      label="Enable Maintenance Mode"
                    />
                    <FormHelperText>
                      When enabled, only logged-in administrators can access the site
                    </FormHelperText>
                  </Grid>

                </Grid>
              </FormSection>

              {/* Maintenance Message - Full Width Section */}
              <FormSection>
                <Grid container>
                  <Grid item xs={12}>
                    <TextField
                      label="Maintenance Message"
                      name="maintenanceMessage"
                      value={settings.maintenanceMessage || 'The site is currently under maintenance. Please check back later.'}
                      onChange={handleChange}
                      multiline
                      rows={8}
                      fullWidth
                      disabled={!settings.maintenanceMode}
                      helperText="Message displayed to visitors when maintenance mode is active"
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      label="Bypass IP Addresses"
                      name="maintenanceBypassIps"
                      value={Array.isArray(settings.maintenanceBypassIps) ? settings.maintenanceBypassIps.join('\n') : ''}
                      onChange={(e) => {
                        const ips = e.target.value.split('\n').filter(ip => ip.trim());
                        setSettings(prev => ({
                          ...prev,
                          maintenanceBypassIps: ips
                        }));
                      }}
                      multiline
                      rows={4}
                      fullWidth
                      disabled={!settings.maintenanceMode}
                      placeholder="192.168.1.1&#10;10.0.0.1"
                      helperText="Enter IP addresses (one per line) that can bypass maintenance mode"
                    />
                  </Grid>
                </Grid>
              </FormSection>

              <Divider sx={{ my: 3 }} />
              
              <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  disabled={saving}
                >
                  {saving ? 'Saving...' : 'Save Settings'}
                </Button>
              </Box>
            </Box>
          </Paper>
        </Box>
      </Container>
    </AdminLayout>
  );
};

export default Settings;
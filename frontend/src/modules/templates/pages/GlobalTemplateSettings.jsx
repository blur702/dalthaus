import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Snackbar,
  Alert,
  CircularProgress,
  Container,
  Drawer,
  IconButton,
  ToggleButton,
  ToggleButtonGroup,
  Divider,
} from '@mui/material';
import {
  Save as SaveIcon,
  RestartAlt as ResetIcon,
  Computer as DesktopIcon,
  Tablet as TabletIcon,
  PhoneIphone as MobileIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
} from '@mui/icons-material';
import AdminLayout from '../../../components/AdminLayout';
import GlobalSettingsEditor from '../components/GlobalSettingsEditor';
import TemplatePreview from '../components/TemplatePreview';
import templateService from '../services/templateService';

const GlobalTemplateSettings = ({ setIsAuthenticated }) => {
  const [globalSettings, setGlobalSettings] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [hasChanges, setHasChanges] = useState(false);
  const [previewMode, setPreviewMode] = useState('desktop');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const drawerWidth = 600;

  useEffect(() => {
    loadGlobalSettings();
  }, []);

  const loadGlobalSettings = async () => {
    setLoading(true);
    try {
      const result = await templateService.getGlobalSettings();
      if (result.success) {
        setGlobalSettings(result.settings || {});
      }
    } catch (error) {
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
    setGlobalSettings(updatedSettings);
    setHasChanges(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const result = await templateService.updateGlobalSettings(globalSettings.globalSettings || globalSettings);
      if (result.success) {
        setSnackbar({
          open: true,
          message: 'Global settings saved successfully!',
          severity: 'success'
        });
        setHasChanges(false);
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Failed to save global settings',
        severity: 'error'
      });
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    loadGlobalSettings();
    setHasChanges(false);
    setSnackbar({
      open: true,
      message: 'Settings reset to last saved state',
      severity: 'info'
    });
  };

  return (
    <AdminLayout setIsAuthenticated={setIsAuthenticated}>
      <Box sx={{ display: 'flex', height: 'calc(100vh - 64px)', position: 'relative' }}>
        {/* Settings Sidebar */}
        <Drawer
          variant="persistent"
          anchor="left"
          open={sidebarOpen}
          sx={{
            width: sidebarOpen ? drawerWidth : 0,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: drawerWidth,
              boxSizing: 'border-box',
              position: 'relative',
              height: '100%',
              borderRight: '1px solid',
              borderColor: 'divider',
            },
          }}
        >
          <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            {/* Header */}
            <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h5">
                  Global Template Settings
                </Typography>
                <IconButton onClick={() => setSidebarOpen(false)}>
                  <ChevronLeftIcon />
                </IconButton>
              </Box>
              <Typography variant="body2" color="text.secondary">
                Define default styles and settings that will be applied across all templates.
              </Typography>
            </Box>

            {/* Settings Content */}
            <Box sx={{ flexGrow: 1, overflow: 'auto', p: 2 }}>
              {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                  <CircularProgress />
                </Box>
              ) : (
                <GlobalSettingsEditor
                  templateData={globalSettings}
                  onTemplateChange={handleSettingsChange}
                />
              )}
            </Box>

            {/* Action Buttons */}
            <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<ResetIcon />}
                  onClick={handleReset}
                  disabled={!hasChanges || saving}
                >
                  Reset
                </Button>
                <Button
                  fullWidth
                  variant="contained"
                  color="primary"
                  startIcon={<SaveIcon />}
                  onClick={handleSave}
                  disabled={!hasChanges || saving}
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </Button>
              </Box>
            </Box>
          </Box>
        </Drawer>

        {/* Main Content Area with Preview */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            display: 'flex',
            flexDirection: 'column',
            transition: 'margin 0.3s',
            marginLeft: sidebarOpen ? 0 : `-${drawerWidth}px`,
          }}
        >
          {/* Preview Header */}
          <Paper sx={{ p: 2, borderRadius: 0, borderBottom: 1, borderColor: 'divider' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                {!sidebarOpen && (
                  <IconButton onClick={() => setSidebarOpen(true)}>
                    <ChevronRightIcon />
                  </IconButton>
                )}
                <Typography variant="h6">
                  Live Preview
                </Typography>
              </Box>
              
              {/* Preview Mode Toggle */}
              <ToggleButtonGroup
                value={previewMode}
                exclusive
                onChange={(e, newMode) => newMode && setPreviewMode(newMode)}
                size="small"
              >
                <ToggleButton value="mobile" aria-label="mobile preview">
                  <MobileIcon />
                </ToggleButton>
                <ToggleButton value="tablet" aria-label="tablet preview">
                  <TabletIcon />
                </ToggleButton>
                <ToggleButton value="desktop" aria-label="desktop preview">
                  <DesktopIcon />
                </ToggleButton>
              </ToggleButtonGroup>
            </Box>
          </Paper>

          {/* Preview Content */}
          <Box sx={{ flexGrow: 1, overflow: 'hidden', backgroundColor: '#f5f5f5' }}>
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                <CircularProgress />
              </Box>
            ) : (
              <TemplatePreview 
                settings={globalSettings.globalSettings || globalSettings}
                previewMode={previewMode}
              />
            )}
          </Box>
        </Box>

        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </AdminLayout>
  );
};

export default GlobalTemplateSettings;
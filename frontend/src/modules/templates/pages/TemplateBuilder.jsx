import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Button,
  AppBar,
  Toolbar,
  IconButton,
  Tooltip,
  Menu,
  MenuItem,
  Divider,
  Snackbar,
  Alert,
  Tabs,
  Tab,
} from '@mui/material';
import {
  Save as SaveIcon,
  Preview as PreviewIcon,
  Fullscreen as FullscreenIcon,
  FullscreenExit as FullscreenExitIcon,
  MoreVert as MoreVertIcon,
  Code as CodeIcon,
  Download as DownloadIcon,
  Upload as UploadIcon,
} from '@mui/icons-material';
import FrontPageTemplate from '../components/FrontPageTemplate';
import ContentPageTemplate from '../components/ContentPageTemplate';
import TemplateCustomizer from '../components/TemplateCustomizer';
import HeaderFooterEditor from '../components/HeaderFooterEditor';
import GlobalSettingsEditor from '../components/GlobalSettingsEditor';
import AdminLayout from '../../../components/AdminLayout';
import templateService from '../services/templateService';
import settingsService from '../../settings/services/settingsService';
import '../../../test-template-builder'; // Test to verify changes are being served

const TemplateBuilder = ({ setIsAuthenticated }) => {
  const { id } = useParams();
  const [templateId, setTemplateId] = useState(id || null);
  const [globalSettings, setGlobalSettings] = useState(null);
  const [templateData, setTemplateData] = useState({
    siteTitle: 'Don Althaus',
    siteSubtitle: 'photography',
    missionTitle: "It's all about storytelling...",
    missionText: "Effective storytelling is the heart and soul of photography. It's what draws your readers in and it's what keeps your reader's attention. (And yes, they are readers...)",
    showMission: true,
    articlesTitle: 'Getting up to speed with storytelling',
    photoBooksTitle: 'Photo Books',
    maxArticles: 3,
    maxPhotoBooks: 2,
    primaryColor: '#2c3e50',
    secondaryColor: '#3498db',
    bannerImage: null,
    bannerHeight: 350,
    contentWidth: 'lg',
    headingFont: 'Roboto',
    bodyFont: 'Open Sans',
    baseFontSize: 16,
    templateType: 'front_page',
  });

  const [isFullscreen, setIsFullscreen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [activeEditorTab, setActiveEditorTab] = useState(0);
  
  // Sample data for preview
  const [articles, setArticles] = useState([]);
  const [photoBooks, setPhotoBooks] = useState([]);

  const handleTemplateChange = (newData) => {
    setTemplateData(newData);
  };

  const handleSave = async (data) => {
    setIsSaving(true);
    try {
      const templateConfig = templateService.buildTemplateConfig(data);
      
      let result;
      if (templateId) {
        // Update existing template
        result = await templateService.updateTemplate(templateId, {
          ...templateConfig,
          name: data.templateName || 'My Template',
          type: 'front_page',
          description: data.templateDescription || ''
        });
      } else {
        // Create new template
        result = await templateService.createTemplate({
          ...templateConfig,
          name: data.templateName || 'My Template',
          slug: (data.templateName || 'my-template').toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          type: data.templateType || 'front_page',
          description: data.templateDescription || ''
        });
        
        if (result.success && result.template) {
          setTemplateId(result.template.id);
        }
      }
      
      setSnackbar({
        open: true,
        message: result.message || 'Template saved successfully!',
        severity: 'success'
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.response?.data?.message || 'Failed to save template. Please try again.',
        severity: 'error'
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleExportTemplate = () => {
    const templateJson = JSON.stringify(templateData, null, 2);
    const blob = new Blob([templateJson], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'template-config.json';
    a.click();
    URL.revokeObjectURL(url);
    handleMenuClose();
  };

  const handleImportTemplate = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const imported = JSON.parse(e.target.result);
          
          // Import to backend
          const result = await templateService.importTemplate(imported);
          
          if (result.success && result.template) {
            setTemplateId(result.template.id);
            const flattened = templateService.flattenTemplateConfig(result.template);
            setTemplateData(flattened);
          }
          
          setSnackbar({
            open: true,
            message: 'Template imported successfully!',
            severity: 'success'
          });
        } catch (error) {
          setSnackbar({
            open: true,
            message: error.response?.data?.message || 'Invalid template file format.',
            severity: 'error'
          });
        }
      };
      reader.readAsText(file);
    }
    handleMenuClose();
  };

  const handleGenerateCode = async () => {
    try {
      // Export current template configuration
      if (templateId) {
        const result = await templateService.exportTemplate(templateId);
        if (result.success) {
          const templateJson = JSON.stringify(result.template, null, 2);
          const blob = new Blob([templateJson], { type: 'application/json' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `template-${result.template.slug || 'export'}.json`;
          a.click();
          URL.revokeObjectURL(url);
        }
      } else {
        // Export current unsaved configuration
        handleExportTemplate();
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Failed to generate template code.',
        severity: 'error'
      });
    }
    handleMenuClose();
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  // Load template if editing and fetch global settings
  useEffect(() => {
    fetchGlobalSettings();
    if (id) {
      loadTemplate(id);
    }
  }, [id]);

  const fetchGlobalSettings = async () => {
    try {
      const result = await settingsService.getGlobalSettings();
      if (result.success && result.settings) {
        setGlobalSettings(result.settings);
        
        // If we don't have a template ID (creating new), apply global settings as defaults
        if (!id) {
          setTemplateData(prevData => ({
            ...prevData,
            primaryColor: result.settings.primaryColor || prevData.primaryColor,
            secondaryColor: result.settings.secondaryColor || prevData.secondaryColor,
            headingFont: result.settings.primaryFont || prevData.headingFont,
            bodyFont: result.settings.secondaryFont || prevData.bodyFont,
            baseFontSize: result.settings.baseFontSize || prevData.baseFontSize,
            // Add any other global settings that should be applied as defaults
          }));
        }
      }
    } catch (error) {
      console.error('Failed to fetch global settings:', error);
    }
  };

  const loadTemplate = async (templateId) => {
    try {
      const result = await templateService.getTemplate(templateId);
      if (result.success && result.template) {
        const flattened = templateService.flattenTemplateConfig(result.template);
        setTemplateData(flattened);
        setTemplateId(result.template.id);
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Failed to load template',
        severity: 'error'
      });
    }
  };

  return (
    <AdminLayout setIsAuthenticated={setIsAuthenticated}>
      <Box sx={{ flexGrow: 1, height: '100vh', display: 'flex', flexDirection: 'column' }}>
        {/* Header Toolbar */}
        <AppBar position="static" color="default" elevation={1}>
          <Toolbar>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              Template Builder
            </Typography>
            
            <Tooltip title="Toggle fullscreen preview">
              <IconButton onClick={toggleFullscreen} sx={{ mr: 1 }}>
                {isFullscreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
              </IconButton>
            </Tooltip>
            
            <Tooltip title="Save template">
              <IconButton 
                onClick={() => handleSave(templateData)} 
                disabled={isSaving}
                sx={{ mr: 1 }}
              >
                <SaveIcon />
              </IconButton>
            </Tooltip>
            
            <Tooltip title="More options">
              <IconButton onClick={handleMenuOpen}>
                <MoreVertIcon />
              </IconButton>
            </Tooltip>
            
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
            >
              <MenuItem onClick={handleExportTemplate}>
                <DownloadIcon sx={{ mr: 1 }} fontSize="small" />
                Export Template
              </MenuItem>
              <MenuItem component="label">
                <UploadIcon sx={{ mr: 1 }} fontSize="small" />
                Import Template
                <input
                  type="file"
                  accept=".json"
                  hidden
                  onChange={handleImportTemplate}
                />
              </MenuItem>
              <Divider />
              <MenuItem onClick={handleGenerateCode}>
                <CodeIcon sx={{ mr: 1 }} fontSize="small" />
                Generate Code
              </MenuItem>
            </Menu>
          </Toolbar>
        </AppBar>

        {/* Main Content */}
        <Box sx={{ flexGrow: 1, overflow: 'hidden' }}>
          <Grid container sx={{ height: '100%' }}>
            {/* Customizer Panel - Left Side */}
            {!isFullscreen && (
              <Grid item xs={12} md={5} lg={4}>
                <Box sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  borderRight: 2,
                  borderColor: 'divider',
                  backgroundColor: 'background.paper'
                }}>
                  <Tabs
                    value={activeEditorTab}
                    onChange={(e, value) => setActiveEditorTab(value)}
                    variant="fullWidth"
                    sx={{ borderBottom: 1, borderColor: 'divider' }}
                  >
                    <Tab label="Content" />
                    <Tab label="Header/Footer" />
                    <Tab label="Global" />
                  </Tabs>
                  <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
                    {activeEditorTab === 0 && (
                      <TemplateCustomizer
                        templateData={templateData}
                        onTemplateChange={handleTemplateChange}
                        onSave={handleSave}
                        onReset={() => setTemplateData({})}
                        isSaving={isSaving}
                      />
                    )}
                    {activeEditorTab === 1 && (
                      <HeaderFooterEditor
                        templateData={templateData}
                        onTemplateChange={handleTemplateChange}
                      />
                    )}
                    {activeEditorTab === 2 && (
                      <GlobalSettingsEditor
                        templateData={templateData}
                        onTemplateChange={handleTemplateChange}
                      />
                    )}
                  </Box>
                </Box>
              </Grid>
            )}
            
            {/* Preview Panel - Right Side */}
            <Grid item xs={12} md={isFullscreen ? 12 : 7} lg={isFullscreen ? 12 : 8}>
              <Box
                sx={{
                  height: '100%',
                  overflow: 'auto',
                  backgroundColor: '#f5f5f5',
                  position: 'relative'
                }}
              >
                {/* Preview Header */}
                <Paper 
                  elevation={0} 
                  sx={{ 
                    p: 2, 
                    borderBottom: 1, 
                    borderColor: 'divider',
                    backgroundColor: 'background.paper',
                    position: 'sticky',
                    top: 0,
                    zIndex: 10,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2
                  }}
                >
                  <PreviewIcon color="primary" />
                  <Typography variant="subtitle1" sx={{ flexGrow: 1 }}>
                    Live Preview
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Changes are reflected in real-time
                  </Typography>
                </Paper>
                
                {/* Template Preview */}
                <Box sx={{
                  backgroundColor: 'white',
                  minHeight: 'calc(100% - 64px)',
                  boxShadow: '0 0 20px rgba(0,0,0,0.1)',
                  margin: isFullscreen ? '0' : '20px',
                  transform: isFullscreen ? 'scale(1)' : 'scale(1)',
                  transformOrigin: 'top center',
                  transition: 'all 0.3s ease',
                }}>
                  {templateData.templateType === 'content_page' ? (
                    <ContentPageTemplate templateData={templateData} />
                  ) : (
                    <FrontPageTemplate
                      templateData={templateData}
                      articles={articles}
                      photoBooks={photoBooks}
                      isPreview={true}
                    />
                  )}
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Box>

        {/* Snackbar for notifications */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
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

export default TemplateBuilder;
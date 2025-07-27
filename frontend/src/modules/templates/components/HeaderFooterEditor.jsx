import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Switch,
  FormControlLabel,
  Slider,
  Grid,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  IconButton,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
  Tabs,
  Tab,
  Divider,
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  CloudUpload as CloudUploadIcon,
  Image as ImageIcon,
  ColorLens as ColorLensIcon,
  Height as HeightIcon,
  PushPin as PushPinIcon,
  Opacity as OpacityIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';

// Simple color input component
const ColorInput = ({ value, onChange, label }) => {
  return (
    <Box>
      <Typography variant="caption" color="text.secondary" gutterBottom>
        {label}
      </Typography>
      <TextField
        fullWidth
        type="color"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        variant="outlined"
        size="small"
        InputProps={{
          style: { height: '40px' }
        }}
      />
    </Box>
  );
};

const HeaderFooterEditor = ({ templateData, onTemplateChange }) => {
  const [activeTab, setActiveTab] = useState(0);
  
  // Default header/footer settings
  const defaultSettings = {
    header: {
      height: 80,
      width: 100,
      widthUnit: '%',
      sticky: false,
      backgroundColor: '#ffffff',
      backgroundImage: null,
      backgroundOpacity: 100,
      backgroundPosition: 'center',
      backgroundSize: 'cover',
      backgroundRepeat: 'no-repeat',
      padding: { top: 20, bottom: 20, left: 20, right: 20 },
      boxShadow: '0px 2px 4px rgba(0,0,0,0.1)',
      borderBottom: '1px solid #e0e0e0',
    },
    footer: {
      height: 200,
      width: 100,
      widthUnit: '%',
      backgroundColor: '#2c3e50',
      backgroundImage: null,
      backgroundOpacity: 100,
      backgroundPosition: 'center',
      backgroundSize: 'cover',
      backgroundRepeat: 'no-repeat',
      padding: { top: 40, bottom: 40, left: 20, right: 20 },
      textColor: '#ffffff',
      linkColor: '#3498db',
      layout: 'three-column',
      showSocialLinks: true,
      showContactInfo: true,
      showNewsletter: false,
    }
  };

  const settings = {
    header: { ...defaultSettings.header, ...(templateData?.headerSettings || {}) },
    footer: { ...defaultSettings.footer, ...(templateData?.footerSettings || {}) }
  };

  const handleChange = (section, field, value) => {
    const updatedSettings = {
      ...templateData,
      [`${section}Settings`]: {
        ...settings[section],
        [field]: value
      }
    };
    onTemplateChange(updatedSettings);
  };

  const handlePaddingChange = (section, side, value) => {
    const updatedPadding = {
      ...settings[section].padding,
      [side]: value
    };
    handleChange(section, 'padding', updatedPadding);
  };

  const handleImageUpload = (section, event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        handleChange(section, 'backgroundImage', e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const renderHeaderSettings = () => (
    <Box>
      {/* Dimensions */}
      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <HeightIcon color="primary" />
            <Typography variant="h6">Dimensions</Typography>
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Typography gutterBottom>Height (px)</Typography>
              <Slider
                value={settings.header.height}
                onChange={(e, value) => handleChange('header', 'height', value)}
                min={40}
                max={200}
                step={10}
                valueLabelDisplay="auto"
                marks={[
                  { value: 60, label: '60px' },
                  { value: 80, label: '80px' },
                  { value: 120, label: '120px' },
                  { value: 160, label: '160px' },
                ]}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography gutterBottom>Width</Typography>
              <TextField
                fullWidth
                value={settings.header.width}
                onChange={(e) => handleChange('header', 'width', e.target.value)}
                type="number"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <Select
                        value={settings.header.widthUnit}
                        onChange={(e) => handleChange('header', 'widthUnit', e.target.value)}
                        variant="standard"
                      >
                        <MenuItem value="%">%</MenuItem>
                        <MenuItem value="px">px</MenuItem>
                      </Select>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>

      {/* Behavior */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <PushPinIcon color="primary" />
            <Typography variant="h6">Behavior</Typography>
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          <FormControlLabel
            control={
              <Switch
                checked={settings.header.sticky}
                onChange={(e) => handleChange('header', 'sticky', e.target.checked)}
              />
            }
            label="Sticky Header (stays at top when scrolling)"
          />
        </AccordionDetails>
      </Accordion>

      {/* Background */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <ColorLensIcon color="primary" />
            <Typography variant="h6">Background</Typography>
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <ColorInput
                label="Background Color"
                value={settings.header.backgroundColor}
                onChange={(color) => handleChange('header', 'backgroundColor', color)}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="caption" color="text.secondary" gutterBottom>
                Background Opacity (%)
              </Typography>
              <Slider
                value={settings.header.backgroundOpacity}
                onChange={(e, value) => handleChange('header', 'backgroundOpacity', value)}
                min={0}
                max={100}
                valueLabelDisplay="auto"
              />
            </Grid>
            <Grid item xs={12}>
              <input
                accept="image/*"
                style={{ display: 'none' }}
                id="header-bg-upload"
                type="file"
                onChange={(e) => handleImageUpload('header', e)}
              />
              <label htmlFor="header-bg-upload">
                <Button
                  variant="outlined"
                  component="span"
                  startIcon={<CloudUploadIcon />}
                  fullWidth
                >
                  Upload Background Image
                </Button>
              </label>
              {settings.header.backgroundImage && (
                <Box sx={{ mt: 2 }}>
                  <img 
                    src={settings.header.backgroundImage} 
                    alt="Header background" 
                    style={{ 
                      width: '100%', 
                      height: '100px', 
                      objectFit: 'cover',
                      borderRadius: '4px'
                    }} 
                  />
                  <Button
                    size="small"
                    color="error"
                    startIcon={<DeleteIcon />}
                    onClick={() => handleChange('header', 'backgroundImage', null)}
                    sx={{ mt: 1 }}
                  >
                    Remove Image
                  </Button>
                </Box>
              )}
            </Grid>
            {settings.header.backgroundImage && (
              <>
                <Grid item xs={12} md={4}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Position</InputLabel>
                    <Select
                      value={settings.header.backgroundPosition}
                      onChange={(e) => handleChange('header', 'backgroundPosition', e.target.value)}
                      label="Position"
                    >
                      <MenuItem value="center">Center</MenuItem>
                      <MenuItem value="top">Top</MenuItem>
                      <MenuItem value="bottom">Bottom</MenuItem>
                      <MenuItem value="left">Left</MenuItem>
                      <MenuItem value="right">Right</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={4}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Size</InputLabel>
                    <Select
                      value={settings.header.backgroundSize}
                      onChange={(e) => handleChange('header', 'backgroundSize', e.target.value)}
                      label="Size"
                    >
                      <MenuItem value="cover">Cover</MenuItem>
                      <MenuItem value="contain">Contain</MenuItem>
                      <MenuItem value="auto">Auto</MenuItem>
                      <MenuItem value="100% 100%">Stretch</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={4}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Repeat</InputLabel>
                    <Select
                      value={settings.header.backgroundRepeat}
                      onChange={(e) => handleChange('header', 'backgroundRepeat', e.target.value)}
                      label="Repeat"
                    >
                      <MenuItem value="no-repeat">No Repeat</MenuItem>
                      <MenuItem value="repeat">Repeat</MenuItem>
                      <MenuItem value="repeat-x">Repeat X</MenuItem>
                      <MenuItem value="repeat-y">Repeat Y</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </>
            )}
          </Grid>
        </AccordionDetails>
      </Accordion>

      {/* Spacing */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">Spacing & Effects</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="subtitle2" gutterBottom>Padding</Typography>
            </Grid>
            <Grid item xs={6} md={3}>
              <TextField
                fullWidth
                label="Top"
                type="number"
                value={settings.header.padding.top}
                onChange={(e) => handlePaddingChange('header', 'top', parseInt(e.target.value))}
                InputProps={{ endAdornment: <InputAdornment position="end">px</InputAdornment> }}
                size="small"
              />
            </Grid>
            <Grid item xs={6} md={3}>
              <TextField
                fullWidth
                label="Bottom"
                type="number"
                value={settings.header.padding.bottom}
                onChange={(e) => handlePaddingChange('header', 'bottom', parseInt(e.target.value))}
                InputProps={{ endAdornment: <InputAdornment position="end">px</InputAdornment> }}
                size="small"
              />
            </Grid>
            <Grid item xs={6} md={3}>
              <TextField
                fullWidth
                label="Left"
                type="number"
                value={settings.header.padding.left}
                onChange={(e) => handlePaddingChange('header', 'left', parseInt(e.target.value))}
                InputProps={{ endAdornment: <InputAdornment position="end">px</InputAdornment> }}
                size="small"
              />
            </Grid>
            <Grid item xs={6} md={3}>
              <TextField
                fullWidth
                label="Right"
                type="number"
                value={settings.header.padding.right}
                onChange={(e) => handlePaddingChange('header', 'right', parseInt(e.target.value))}
                InputProps={{ endAdornment: <InputAdornment position="end">px</InputAdornment> }}
                size="small"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Box Shadow"
                value={settings.header.boxShadow}
                onChange={(e) => handleChange('header', 'boxShadow', e.target.value)}
                placeholder="e.g., 0px 2px 4px rgba(0,0,0,0.1)"
                size="small"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Border Bottom"
                value={settings.header.borderBottom}
                onChange={(e) => handleChange('header', 'borderBottom', e.target.value)}
                placeholder="e.g., 1px solid #e0e0e0"
                size="small"
              />
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>
    </Box>
  );

  const renderFooterSettings = () => (
    <Box>
      {/* Dimensions */}
      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <HeightIcon color="primary" />
            <Typography variant="h6">Dimensions</Typography>
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Typography gutterBottom>Height (px)</Typography>
              <Slider
                value={settings.footer.height}
                onChange={(e, value) => handleChange('footer', 'height', value)}
                min={100}
                max={400}
                step={20}
                valueLabelDisplay="auto"
                marks={[
                  { value: 150, label: '150px' },
                  { value: 200, label: '200px' },
                  { value: 250, label: '250px' },
                  { value: 300, label: '300px' },
                ]}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography gutterBottom>Width</Typography>
              <TextField
                fullWidth
                value={settings.footer.width}
                onChange={(e) => handleChange('footer', 'width', e.target.value)}
                type="number"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <Select
                        value={settings.footer.widthUnit}
                        onChange={(e) => handleChange('footer', 'widthUnit', e.target.value)}
                        variant="standard"
                      >
                        <MenuItem value="%">%</MenuItem>
                        <MenuItem value="px">px</MenuItem>
                      </Select>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>

      {/* Background */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <ColorLensIcon color="primary" />
            <Typography variant="h6">Background & Colors</Typography>
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <ColorInput
                label="Background Color"
                value={settings.footer.backgroundColor}
                onChange={(color) => handleChange('footer', 'backgroundColor', color)}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <ColorInput
                label="Text Color"
                value={settings.footer.textColor}
                onChange={(color) => handleChange('footer', 'textColor', color)}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <ColorInput
                label="Link Color"
                value={settings.footer.linkColor}
                onChange={(color) => handleChange('footer', 'linkColor', color)}
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="caption" color="text.secondary" gutterBottom>
                Background Opacity (%)
              </Typography>
              <Slider
                value={settings.footer.backgroundOpacity}
                onChange={(e, value) => handleChange('footer', 'backgroundOpacity', value)}
                min={0}
                max={100}
                valueLabelDisplay="auto"
              />
            </Grid>
            <Grid item xs={12}>
              <input
                accept="image/*"
                style={{ display: 'none' }}
                id="footer-bg-upload"
                type="file"
                onChange={(e) => handleImageUpload('footer', e)}
              />
              <label htmlFor="footer-bg-upload">
                <Button
                  variant="outlined"
                  component="span"
                  startIcon={<CloudUploadIcon />}
                  fullWidth
                >
                  Upload Background Image
                </Button>
              </label>
              {settings.footer.backgroundImage && (
                <Box sx={{ mt: 2 }}>
                  <img 
                    src={settings.footer.backgroundImage} 
                    alt="Footer background" 
                    style={{ 
                      width: '100%', 
                      height: '100px', 
                      objectFit: 'cover',
                      borderRadius: '4px'
                    }} 
                  />
                  <Button
                    size="small"
                    color="error"
                    startIcon={<DeleteIcon />}
                    onClick={() => handleChange('footer', 'backgroundImage', null)}
                    sx={{ mt: 1 }}
                  >
                    Remove Image
                  </Button>
                </Box>
              )}
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>

      {/* Layout */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">Layout & Content</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Footer Layout</InputLabel>
                <Select
                  value={settings.footer.layout}
                  onChange={(e) => handleChange('footer', 'layout', e.target.value)}
                  label="Footer Layout"
                >
                  <MenuItem value="single-column">Single Column</MenuItem>
                  <MenuItem value="two-column">Two Column</MenuItem>
                  <MenuItem value="three-column">Three Column</MenuItem>
                  <MenuItem value="four-column">Four Column</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.footer.showSocialLinks}
                    onChange={(e) => handleChange('footer', 'showSocialLinks', e.target.checked)}
                  />
                }
                label="Show Social Links"
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.footer.showContactInfo}
                    onChange={(e) => handleChange('footer', 'showContactInfo', e.target.checked)}
                  />
                }
                label="Show Contact Information"
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.footer.showNewsletter}
                    onChange={(e) => handleChange('footer', 'showNewsletter', e.target.checked)}
                  />
                }
                label="Show Newsletter Signup"
              />
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>

      {/* Spacing */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">Spacing</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="subtitle2" gutterBottom>Padding</Typography>
            </Grid>
            <Grid item xs={6} md={3}>
              <TextField
                fullWidth
                label="Top"
                type="number"
                value={settings.footer.padding.top}
                onChange={(e) => handlePaddingChange('footer', 'top', parseInt(e.target.value))}
                InputProps={{ endAdornment: <InputAdornment position="end">px</InputAdornment> }}
                size="small"
              />
            </Grid>
            <Grid item xs={6} md={3}>
              <TextField
                fullWidth
                label="Bottom"
                type="number"
                value={settings.footer.padding.bottom}
                onChange={(e) => handlePaddingChange('footer', 'bottom', parseInt(e.target.value))}
                InputProps={{ endAdornment: <InputAdornment position="end">px</InputAdornment> }}
                size="small"
              />
            </Grid>
            <Grid item xs={6} md={3}>
              <TextField
                fullWidth
                label="Left"
                type="number"
                value={settings.footer.padding.left}
                onChange={(e) => handlePaddingChange('footer', 'left', parseInt(e.target.value))}
                InputProps={{ endAdornment: <InputAdornment position="end">px</InputAdornment> }}
                size="small"
              />
            </Grid>
            <Grid item xs={6} md={3}>
              <TextField
                fullWidth
                label="Right"
                type="number"
                value={settings.footer.padding.right}
                onChange={(e) => handlePaddingChange('footer', 'right', parseInt(e.target.value))}
                InputProps={{ endAdornment: <InputAdornment position="end">px</InputAdornment> }}
                size="small"
              />
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>
    </Box>
  );

  return (
    <Paper elevation={2} sx={{ p: 3, height: '100%', overflow: 'auto' }}>
      <Typography variant="h5" gutterBottom>
        Header & Footer Settings
      </Typography>
      
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={activeTab} onChange={(e, value) => setActiveTab(value)}>
          <Tab label="Header Settings" />
          <Tab label="Footer Settings" />
        </Tabs>
      </Box>

      {activeTab === 0 ? renderHeaderSettings() : renderFooterSettings()}
    </Paper>
  );
};

export default HeaderFooterEditor;
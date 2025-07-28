import React, { useState } from 'react';
import {
  Box,
  TextField,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  IconButton,
  InputAdornment,
  Slider,
  Paper,
  Divider,
  Stack,
  Chip,
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  Upload as UploadIcon,
  Delete as DeleteIcon,
  ColorLens as ColorLensIcon,
  Image as ImageIcon,
} from '@mui/icons-material';
import { ChromePicker } from 'react-color';
import api from '../../../services/api';

const GlobalSettingsEditor = ({ templateData = {}, onTemplateChange }) => {
  const [settings, setSettings] = useState(templateData || {});
  
  const [showColorPicker, setShowColorPicker] = useState({});
  const [uploading, setUploading] = useState(false);

  const handleChange = (field, value) => {
    const updatedSettings = {
      ...settings,
      [field]: value
    };
    setSettings(updatedSettings);
    onTemplateChange(updatedSettings);
  };

  const handleNestedChange = (parent, field, value) => {
    const updatedSettings = {
      ...settings,
      [parent]: {
        ...settings[parent],
        [field]: value
      }
    };
    setSettings(updatedSettings);
    onTemplateChange(updatedSettings);
  };

  const handleHeaderImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await api.post('/settings/global/header-image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.data.success) {
        handleChange('headerBackgroundImage', response.data.imageUrl);
      }
    } catch (error) {
      console.error('Error uploading header image:', error);
      alert('Failed to upload header image');
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteHeaderImage = async () => {
    if (!window.confirm('Are you sure you want to delete the header background image?')) {
      return;
    }

    try {
      const response = await api.delete('/settings/global/header-image');
      if (response.data.success) {
        handleChange('headerBackgroundImage', null);
      }
    } catch (error) {
      console.error('Error deleting header image:', error);
      alert('Failed to delete header image');
    }
  };

  const ColorPickerField = ({ label, field, value }) => {
    const isOpen = showColorPicker[field];

    return (
      <FormControl fullWidth>
        <TextField
          label={label}
          value={value || ''}
          onChange={(e) => handleChange(field, e.target.value)}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setShowColorPicker({ ...showColorPicker, [field]: !isOpen })}
                  edge="end"
                >
                  <ColorLensIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        {isOpen && (
          <Box sx={{ position: 'absolute', zIndex: 2, mt: 8 }}>
            <ChromePicker
              color={value || '#000000'}
              onChange={(color) => {
                const rgba = `rgba(${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b}, ${color.rgb.a})`;
                handleChange(field, rgba);
              }}
            />
            <Button
              size="small"
              onClick={() => setShowColorPicker({ ...showColorPicker, [field]: false })}
              sx={{ mt: 1 }}
            >
              Close
            </Button>
          </Box>
        )}
      </FormControl>
    );
  };

  return (
    <Box>
      {/* Typography Settings */}
      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">Typography</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Primary Font"
                value={settings?.primaryFont || ''}
                onChange={(e) => handleChange('primaryFont', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Secondary Font"
                value={settings?.secondaryFont || ''}
                onChange={(e) => handleChange('secondaryFont', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Base Font Size (px)"
                type="number"
                value={settings?.baseFontSize || 16}
                onChange={(e) => handleChange('baseFontSize', parseInt(e.target.value))}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Line Height"
                type="number"
                step="0.1"
                value={settings?.lineHeight || 1.6}
                onChange={(e) => handleChange('lineHeight', parseFloat(e.target.value))}
              />
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>

      {/* Color Settings */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">Colors</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <ColorPickerField
                label="Primary Color"
                field="primaryColor"
                value={settings?.primaryColor}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <ColorPickerField
                label="Secondary Color"
                field="secondaryColor"
                value={settings?.secondaryColor}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <ColorPickerField
                label="Background Color"
                field="backgroundColor"
                value={settings?.backgroundColor}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <ColorPickerField
                label="Text Color"
                field="textColor"
                value={settings?.textColor}
              />
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>

      {/* Header Background Settings */}
      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">Header Background</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={3}>
            {/* Background Image Upload */}
            <Grid item xs={12}>
              <Paper variant="outlined" sx={{ p: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Background Image
                </Typography>
                {settings?.headerBackgroundImage ? (
                  <Box>
                    <img
                      src={settings.headerBackgroundImage}
                      alt="Header background"
                      style={{ width: '100%', maxHeight: '200px', objectFit: 'cover', marginBottom: '16px' }}
                    />
                    <Button
                      variant="outlined"
                      color="error"
                      startIcon={<DeleteIcon />}
                      onClick={handleDeleteHeaderImage}
                      fullWidth
                    >
                      Delete Header Image
                    </Button>
                  </Box>
                ) : (
                  <Box>
                    <input
                      accept="image/*"
                      style={{ display: 'none' }}
                      id="header-image-upload"
                      type="file"
                      name="headerBackgroundImage"
                      onChange={handleHeaderImageUpload}
                    />
                    <label htmlFor="header-image-upload">
                      <Button
                        variant="outlined"
                        component="span"
                        startIcon={<UploadIcon />}
                        disabled={uploading}
                        fullWidth
                      >
                        {uploading ? 'Uploading...' : 'Upload Header Image'}
                      </Button>
                    </label>
                  </Box>
                )}
              </Paper>
            </Grid>

            {/* Overlay Settings */}
            <Grid item xs={12} md={6}>
              <ColorPickerField
                label="Overlay Color"
                field="headerOverlayColor"
                value={settings?.headerOverlayColor}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Box>
                <Typography gutterBottom>Overlay Opacity</Typography>
                <Slider
                  value={settings?.headerOverlayOpacity || 0.5}
                  onChange={(e, value) => handleChange('headerOverlayOpacity', value)}
                  min={0}
                  max={1}
                  step={0.1}
                  valueLabelDisplay="auto"
                  marks
                />
              </Box>
            </Grid>

            {/* Position Settings */}
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Background Position</InputLabel>
                <Select
                  name="headerBackgroundPosition"
                  value={settings?.headerBackgroundPosition || 'center center'}
                  onChange={(e) => handleChange('headerBackgroundPosition', e.target.value)}
                >
                  <MenuItem value="left top">Left Top</MenuItem>
                  <MenuItem value="left center">Left Center</MenuItem>
                  <MenuItem value="left bottom">Left Bottom</MenuItem>
                  <MenuItem value="center top">Center Top</MenuItem>
                  <MenuItem value="center center">Center Center</MenuItem>
                  <MenuItem value="center bottom">Center Bottom</MenuItem>
                  <MenuItem value="right top">Right Top</MenuItem>
                  <MenuItem value="right center">Right Center</MenuItem>
                  <MenuItem value="right bottom">Right Bottom</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Background Size</InputLabel>
                <Select
                  name="headerBackgroundSize"
                  value={settings?.headerBackgroundSize || 'cover'}
                  onChange={(e) => handleChange('headerBackgroundSize', e.target.value)}
                >
                  <MenuItem value="auto">Auto</MenuItem>
                  <MenuItem value="cover">Cover</MenuItem>
                  <MenuItem value="contain">Contain</MenuItem>
                  <MenuItem value="100% 100%">Stretch</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Background Repeat</InputLabel>
                <Select
                  name="headerBackgroundRepeat"
                  value={settings?.headerBackgroundRepeat || 'no-repeat'}
                  onChange={(e) => handleChange('headerBackgroundRepeat', e.target.value)}
                >
                  <MenuItem value="no-repeat">No Repeat</MenuItem>
                  <MenuItem value="repeat">Repeat</MenuItem>
                  <MenuItem value="repeat-x">Repeat X</MenuItem>
                  <MenuItem value="repeat-y">Repeat Y</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Background Attachment</InputLabel>
                <Select
                  name="headerBackgroundAttachment"
                  value={settings?.headerBackgroundAttachment || 'scroll'}
                  onChange={(e) => handleChange('headerBackgroundAttachment', e.target.value)}
                >
                  <MenuItem value="scroll">Scroll</MenuItem>
                  <MenuItem value="fixed">Fixed</MenuItem>
                  <MenuItem value="local">Local</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* Header Height */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Header Height"
                name="headerHeight"
                value={settings?.headerHeight || '400px'}
                onChange={(e) => handleChange('headerHeight', e.target.value)}
                helperText="e.g., 400px, 50vh, auto"
              />
            </Grid>

            {/* Content Alignment */}
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Content Alignment</InputLabel>
                <Select
                  value={settings?.headerContentAlignment || 'center'}
                  onChange={(e) => handleChange('headerContentAlignment', e.target.value)}
                >
                  <MenuItem value="left">Left</MenuItem>
                  <MenuItem value="center">Center</MenuItem>
                  <MenuItem value="right">Right</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* Effects */}
            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom>
                Background Effects
              </Typography>
            </Grid>

            <Grid item xs={12} md={3}>
              <Box>
                <Typography gutterBottom>Blur</Typography>
                <Slider
                  name="headerBackgroundBlur"
                  value={settings?.headerBackgroundBlur || 0}
                  onChange={(e, value) => handleChange('headerBackgroundBlur', value)}
                  min={0}
                  max={20}
                  valueLabelDisplay="auto"
                  marks
                />
              </Box>
            </Grid>

            <Grid item xs={12} md={3}>
              <Box>
                <Typography gutterBottom>Brightness (%)</Typography>
                <Slider
                  name="headerBackgroundBrightness"
                  value={settings?.headerBackgroundBrightness || 100}
                  onChange={(e, value) => handleChange('headerBackgroundBrightness', value)}
                  min={0}
                  max={200}
                  valueLabelDisplay="auto"
                  marks
                />
              </Box>
            </Grid>

            <Grid item xs={12} md={3}>
              <Box>
                <Typography gutterBottom>Contrast (%)</Typography>
                <Slider
                  name="headerBackgroundContrast"
                  value={settings?.headerBackgroundContrast || 100}
                  onChange={(e, value) => handleChange('headerBackgroundContrast', value)}
                  min={0}
                  max={200}
                  valueLabelDisplay="auto"
                  marks
                />
              </Box>
            </Grid>

            <Grid item xs={12} md={3}>
              <Box>
                <Typography gutterBottom>Grayscale (%)</Typography>
                <Slider
                  name="headerBackgroundGrayscale"
                  value={settings?.headerBackgroundGrayscale || 0}
                  onChange={(e, value) => handleChange('headerBackgroundGrayscale', value)}
                  min={0}
                  max={100}
                  valueLabelDisplay="auto"
                  marks
                />
              </Box>
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>

      {/* Spacing Settings */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">Spacing</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Container Max Width (px)"
                type="number"
                value={settings?.containerMaxWidth || 1200}
                onChange={(e) => handleChange('containerMaxWidth', parseInt(e.target.value))}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Container Padding (px)"
                type="number"
                value={settings?.containerPadding || 24}
                onChange={(e) => handleChange('containerPadding', parseInt(e.target.value))}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Section Spacing (px)"
                type="number"
                value={settings?.sectionSpacing || 80}
                onChange={(e) => handleChange('sectionSpacing', parseInt(e.target.value))}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Element Spacing (px)"
                type="number"
                value={settings?.elementSpacing || 24}
                onChange={(e) => handleChange('elementSpacing', parseInt(e.target.value))}
              />
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};

export default GlobalSettingsEditor;
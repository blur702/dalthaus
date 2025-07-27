import React from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Slider,
  Grid,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
  Divider,
  Chip,
  FormHelperText,
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  ColorLens as ColorLensIcon,
  TextFields as TextFieldsIcon,
  FormatSize as FormatSizeIcon,
  SpaceBar as SpaceBarIcon,
  Palette as PaletteIcon,
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

// Font preview component
const FontPreview = ({ font, text = "The quick brown fox jumps over the lazy dog" }) => {
  return (
    <Box sx={{ 
      mt: 1, 
      p: 1.5, 
      border: '1px solid', 
      borderColor: 'divider',
      borderRadius: 1,
      fontFamily: font 
    }}>
      <Typography style={{ fontFamily: font }}>{text}</Typography>
    </Box>
  );
};

const GlobalSettingsEditor = ({ templateData, onTemplateChange }) => {
  // Default global settings
  const defaultSettings = {
    global: {
      // Typography
      primaryFont: 'Roboto',
      secondaryFont: 'Open Sans',
      baseFontSize: 16,
      fontScale: 1.25,
      headingWeight: 700,
      bodyWeight: 400,
      lineHeight: 1.6,
      letterSpacing: 0,
      paragraphSpacing: 1,
      
      // Colors
      primaryColor: '#1976d2',
      secondaryColor: '#dc004e',
      textColor: '#333333',
      backgroundColor: '#ffffff',
      surfaceColor: '#f5f5f5',
      errorColor: '#f44336',
      warningColor: '#ff9800',
      infoColor: '#2196f3',
      successColor: '#4caf50',
      
      // Body Settings
      bodyBackgroundColor: '#ffffff',
      bodyTextColor: '#333333',
      bodyLinkColor: '#1976d2',
      bodyLinkHoverColor: '#115293',
      
      // Heading Styles
      h1: { size: 2.5, weight: 700, lineHeight: 1.2, letterSpacing: -0.02, color: null },
      h2: { size: 2, weight: 700, lineHeight: 1.3, letterSpacing: -0.01, color: null },
      h3: { size: 1.75, weight: 600, lineHeight: 1.4, letterSpacing: 0, color: null },
      h4: { size: 1.5, weight: 600, lineHeight: 1.4, letterSpacing: 0, color: null },
      h5: { size: 1.25, weight: 500, lineHeight: 1.5, letterSpacing: 0, color: null },
      h6: { size: 1, weight: 500, lineHeight: 1.5, letterSpacing: 0, color: null },
      
      // Spacing
      containerMaxWidth: 1200,
      containerPadding: 24,
      sectionSpacing: 80,
      elementSpacing: 24,
      componentSpacing: 16,
      
      // Border & Effects
      borderRadius: 4,
      borderColor: '#e0e0e0',
      borderWidth: 1,
      boxShadow: '0px 2px 4px rgba(0,0,0,0.1)',
      
      // Responsive Breakpoints
      breakpoints: {
        xs: 0,
        sm: 600,
        md: 960,
        lg: 1280,
        xl: 1920
      }
    }
  };

  const settings = {
    ...defaultSettings.global,
    ...(templateData?.globalSettings || {})
  };

  const handleChange = (field, value) => {
    const updatedSettings = {
      ...templateData,
      globalSettings: {
        ...settings,
        [field]: value
      }
    };
    onTemplateChange(updatedSettings);
  };

  const handleHeadingChange = (heading, property, value) => {
    const updatedHeadings = {
      ...settings,
      [heading]: {
        ...settings[heading],
        [property]: value
      }
    };
    const updatedSettings = {
      ...templateData,
      globalSettings: updatedHeadings
    };
    onTemplateChange(updatedSettings);
  };

  return (
    <Box sx={{ height: '100%' }}>
      <Typography variant="body2" color="text.secondary" paragraph>
        Changes will be reflected in the preview instantly. These settings will be applied as defaults across all templates unless overridden.
      </Typography>

      {/* Typography Settings */}
      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <TextFieldsIcon color="primary" />
            <Typography variant="h6">Typography</Typography>
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Primary Font (Headings)</InputLabel>
                <Select
                  value={settings.primaryFont}
                  onChange={(e) => handleChange('primaryFont', e.target.value)}
                  label="Primary Font (Headings)"
                >
                  <MenuItem value="Roboto">Roboto</MenuItem>
                  <MenuItem value="Open Sans">Open Sans</MenuItem>
                  <MenuItem value="Lato">Lato</MenuItem>
                  <MenuItem value="Montserrat">Montserrat</MenuItem>
                  <MenuItem value="Playfair Display">Playfair Display</MenuItem>
                  <MenuItem value="Raleway">Raleway</MenuItem>
                  <MenuItem value="Poppins">Poppins</MenuItem>
                  <MenuItem value="Inter">Inter</MenuItem>
                  <MenuItem value="Source Sans Pro">Source Sans Pro</MenuItem>
                  <MenuItem value="Merriweather">Merriweather</MenuItem>
                </Select>
                <FormHelperText>Used for headings and important text</FormHelperText>
              </FormControl>
              <FontPreview font={settings.primaryFont} text="Heading Font Preview" />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Secondary Font (Body)</InputLabel>
                <Select
                  value={settings.secondaryFont}
                  onChange={(e) => handleChange('secondaryFont', e.target.value)}
                  label="Secondary Font (Body)"
                >
                  <MenuItem value="Roboto">Roboto</MenuItem>
                  <MenuItem value="Open Sans">Open Sans</MenuItem>
                  <MenuItem value="Lato">Lato</MenuItem>
                  <MenuItem value="Source Sans Pro">Source Sans Pro</MenuItem>
                  <MenuItem value="Merriweather">Merriweather</MenuItem>
                  <MenuItem value="Georgia">Georgia</MenuItem>
                  <MenuItem value="Inter">Inter</MenuItem>
                  <MenuItem value="Nunito">Nunito</MenuItem>
                  <MenuItem value="Arial">Arial</MenuItem>
                  <MenuItem value="Helvetica">Helvetica</MenuItem>
                </Select>
                <FormHelperText>Used for body text and content</FormHelperText>
              </FormControl>
              <FontPreview font={settings.secondaryFont} />
            </Grid>
            
            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography gutterBottom>Base Font Size (px)</Typography>
              <Slider
                value={settings.baseFontSize}
                onChange={(e, value) => handleChange('baseFontSize', value)}
                min={12}
                max={24}
                marks={[
                  { value: 14, label: '14px' },
                  { value: 16, label: '16px' },
                  { value: 18, label: '18px' },
                  { value: 20, label: '20px' },
                ]}
                valueLabelDisplay="auto"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography gutterBottom>Font Scale Ratio</Typography>
              <Slider
                value={settings.fontScale}
                onChange={(e, value) => handleChange('fontScale', value)}
                min={1.1}
                max={1.5}
                step={0.05}
                marks={[
                  { value: 1.2, label: 'Minor Third' },
                  { value: 1.25, label: 'Major Third' },
                  { value: 1.333, label: 'Perfect Fourth' },
                ]}
                valueLabelDisplay="auto"
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <Typography gutterBottom>Body Line Height</Typography>
              <Slider
                value={settings.lineHeight}
                onChange={(e, value) => handleChange('lineHeight', value)}
                min={1.2}
                max={2}
                step={0.1}
                marks
                valueLabelDisplay="auto"
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography gutterBottom>Letter Spacing (em)</Typography>
              <Slider
                value={settings.letterSpacing}
                onChange={(e, value) => handleChange('letterSpacing', value)}
                min={-0.05}
                max={0.15}
                step={0.01}
                marks
                valueLabelDisplay="auto"
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography gutterBottom>Paragraph Spacing (em)</Typography>
              <Slider
                value={settings.paragraphSpacing}
                onChange={(e, value) => handleChange('paragraphSpacing', value)}
                min={0.5}
                max={2}
                step={0.1}
                marks
                valueLabelDisplay="auto"
              />
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>

      {/* Heading Styles */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <FormatSizeIcon color="primary" />
            <Typography variant="h6">Heading Styles</Typography>
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={2}>
            {['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].map((heading) => (
              <Grid item xs={12} key={heading}>
                <Typography variant="subtitle1" gutterBottom>
                  {heading.toUpperCase()} Settings
                </Typography>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={6} sm={3}>
                    <TextField
                      fullWidth
                      label="Size (rem)"
                      type="number"
                      size="small"
                      value={settings[heading].size}
                      onChange={(e) => handleHeadingChange(heading, 'size', parseFloat(e.target.value))}
                      inputProps={{ step: 0.1, min: 0.5, max: 5 }}
                    />
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <TextField
                      fullWidth
                      label="Weight"
                      type="number"
                      size="small"
                      value={settings[heading].weight}
                      onChange={(e) => handleHeadingChange(heading, 'weight', parseInt(e.target.value))}
                      inputProps={{ step: 100, min: 100, max: 900 }}
                    />
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <TextField
                      fullWidth
                      label="Line Height"
                      type="number"
                      size="small"
                      value={settings[heading].lineHeight}
                      onChange={(e) => handleHeadingChange(heading, 'lineHeight', parseFloat(e.target.value))}
                      inputProps={{ step: 0.1, min: 1, max: 2 }}
                    />
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <ColorInput
                      label="Custom Color"
                      value={settings[heading].color || settings.textColor}
                      onChange={(color) => handleHeadingChange(heading, 'color', color)}
                    />
                  </Grid>
                </Grid>
                {heading !== 'h6' && <Divider sx={{ mt: 2 }} />}
              </Grid>
            ))}
          </Grid>
        </AccordionDetails>
      </Accordion>

      {/* Color Palette */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <PaletteIcon color="primary" />
            <Typography variant="h6">Color Palette</Typography>
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="subtitle2" gutterBottom>Theme Colors</Typography>
            </Grid>
            <Grid item xs={6} sm={4} md={3}>
              <ColorInput
                label="Primary Color"
                value={settings.primaryColor}
                onChange={(color) => handleChange('primaryColor', color)}
              />
            </Grid>
            <Grid item xs={6} sm={4} md={3}>
              <ColorInput
                label="Secondary Color"
                value={settings.secondaryColor}
                onChange={(color) => handleChange('secondaryColor', color)}
              />
            </Grid>
            <Grid item xs={6} sm={4} md={3}>
              <ColorInput
                label="Text Color"
                value={settings.textColor}
                onChange={(color) => handleChange('textColor', color)}
              />
            </Grid>
            <Grid item xs={6} sm={4} md={3}>
              <ColorInput
                label="Background Color"
                value={settings.backgroundColor}
                onChange={(color) => handleChange('backgroundColor', color)}
              />
            </Grid>
            
            <Grid item xs={12}>
              <Divider sx={{ my: 1 }} />
              <Typography variant="subtitle2" gutterBottom sx={{ mt: 2 }}>Status Colors</Typography>
            </Grid>
            <Grid item xs={6} sm={3}>
              <ColorInput
                label="Success"
                value={settings.successColor}
                onChange={(color) => handleChange('successColor', color)}
              />
            </Grid>
            <Grid item xs={6} sm={3}>
              <ColorInput
                label="Error"
                value={settings.errorColor}
                onChange={(color) => handleChange('errorColor', color)}
              />
            </Grid>
            <Grid item xs={6} sm={3}>
              <ColorInput
                label="Warning"
                value={settings.warningColor}
                onChange={(color) => handleChange('warningColor', color)}
              />
            </Grid>
            <Grid item xs={6} sm={3}>
              <ColorInput
                label="Info"
                value={settings.infoColor}
                onChange={(color) => handleChange('infoColor', color)}
              />
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>

      {/* Body Settings */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <ColorLensIcon color="primary" />
            <Typography variant="h6">Body & Content Settings</Typography>
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={3}>
              <ColorInput
                label="Body Background"
                value={settings.bodyBackgroundColor}
                onChange={(color) => handleChange('bodyBackgroundColor', color)}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <ColorInput
                label="Body Text Color"
                value={settings.bodyTextColor}
                onChange={(color) => handleChange('bodyTextColor', color)}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <ColorInput
                label="Link Color"
                value={settings.bodyLinkColor}
                onChange={(color) => handleChange('bodyLinkColor', color)}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <ColorInput
                label="Link Hover Color"
                value={settings.bodyLinkHoverColor}
                onChange={(color) => handleChange('bodyLinkHoverColor', color)}
              />
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>

      {/* Spacing & Layout */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <SpaceBarIcon color="primary" />
            <Typography variant="h6">Spacing & Layout</Typography>
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Container Max Width"
                type="number"
                value={settings.containerMaxWidth}
                onChange={(e) => handleChange('containerMaxWidth', parseInt(e.target.value))}
                InputProps={{
                  endAdornment: <InputAdornment position="end">px</InputAdornment>
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Container Padding"
                type="number"
                value={settings.containerPadding}
                onChange={(e) => handleChange('containerPadding', parseInt(e.target.value))}
                InputProps={{
                  endAdornment: <InputAdornment position="end">px</InputAdornment>
                }}
              />
            </Grid>
            
            <Grid item xs={12}>
              <Divider sx={{ my: 1 }} />
            </Grid>

            <Grid item xs={12} md={4}>
              <Typography gutterBottom>Section Spacing (px)</Typography>
              <Slider
                value={settings.sectionSpacing}
                onChange={(e, value) => handleChange('sectionSpacing', value)}
                min={20}
                max={120}
                step={10}
                marks={[
                  { value: 40, label: '40' },
                  { value: 60, label: '60' },
                  { value: 80, label: '80' },
                  { value: 100, label: '100' },
                ]}
                valueLabelDisplay="auto"
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography gutterBottom>Element Spacing (px)</Typography>
              <Slider
                value={settings.elementSpacing}
                onChange={(e, value) => handleChange('elementSpacing', value)}
                min={8}
                max={48}
                step={4}
                marks
                valueLabelDisplay="auto"
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography gutterBottom>Component Spacing (px)</Typography>
              <Slider
                value={settings.componentSpacing}
                onChange={(e, value) => handleChange('componentSpacing', value)}
                min={4}
                max={32}
                step={4}
                marks
                valueLabelDisplay="auto"
              />
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>

      {/* Borders & Effects */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">Borders & Effects</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Typography gutterBottom>Border Radius (px)</Typography>
              <Slider
                value={settings.borderRadius}
                onChange={(e, value) => handleChange('borderRadius', value)}
                min={0}
                max={24}
                step={2}
                marks={[
                  { value: 0, label: '0' },
                  { value: 4, label: '4' },
                  { value: 8, label: '8' },
                  { value: 12, label: '12' },
                  { value: 16, label: '16' },
                ]}
                valueLabelDisplay="auto"
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <ColorInput
                label="Border Color"
                value={settings.borderColor}
                onChange={(color) => handleChange('borderColor', color)}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Box Shadow"
                value={settings.boxShadow}
                onChange={(e) => handleChange('boxShadow', e.target.value)}
                placeholder="e.g., 0px 2px 4px rgba(0,0,0,0.1)"
                size="small"
              />
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};

export default GlobalSettingsEditor;
import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Switch,
  FormControlLabel,
  Slider,
  Button,
  Grid,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  InputAdornment,
  IconButton,
  Divider,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  CloudUpload as CloudUploadIcon,
  Refresh as RefreshIcon,
  ColorLens as ColorLensIcon,
  FormatSize as FormatSizeIcon,
  ViewModule as ViewModuleIcon,
  Image as ImageIcon,
  TextFields as TextFieldsIcon,
  SpaceBar as SpaceBarIcon,
  Dashboard as DashboardIcon,
  FormatAlignLeft as FormatAlignLeftIcon,
  FormatAlignCenter as FormatAlignCenterIcon,
  FormatAlignRight as FormatAlignRightIcon,
} from '@mui/icons-material';

// Simple color input component
const ColorInput = ({ value, onChange }) => {
  return (
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
  );
};

const TemplateCustomizer = ({
  templateData,
  onTemplateChange,
  onSave,
  onReset,
  isSaving = false
}) => {
  const [localData, setLocalData] = useState({
    // Basic Info
    siteTitle: 'Don Althaus',
    siteSubtitle: 'photography',
    missionTitle: "It's all about storytelling...",
    missionText: "Effective storytelling is the heart and soul of photography. It's what draws your readers in and it's what keeps your reader's attention. (And yes, they are readers...)",
    
    // Display Options
    showMission: true,
    articlesTitle: 'Getting up to speed with storytelling',
    photoBooksTitle: 'Photo Books',
    maxArticles: 3,
    maxPhotoBooks: 2,
    
    // Styling
    primaryColor: '#2c3e50',
    secondaryColor: '#3498db',
    bannerImage: null,
    bannerHeight: 350,
    contentWidth: 'lg',
    
    // Typography
    headingFont: 'Roboto',
    bodyFont: 'Open Sans',
    baseFontSize: 16,
    headingWeight: 700,
    bodyWeight: 400,
    lineHeight: 1.6,
    letterSpacing: 0,
    textTransform: 'none',
    
    // Spacing
    sectionSpacing: 4,
    elementSpacing: 2,
    contentPadding: 3,
    cardSpacing: 3,
    
    // Layout
    templateType: 'front_page',
    layoutVariant: 'classic',
    headerAlignment: 'left',
    contentLayout: 'two-column',
    cardStyle: 'elevated',
    
    ...templateData
  });

  const handleChange = (field, value) => {
    const newData = { ...localData, [field]: value };
    setLocalData(newData);
    if (onTemplateChange) {
      onTemplateChange(newData);
    }
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        handleChange('bannerImage', e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleReset = () => {
    const defaultData = {
      siteTitle: 'Your Site Title',
      siteSubtitle: 'Your tagline here',
      missionTitle: 'Your Mission Statement',
      missionText: 'Describe your mission and vision here...',
      showMission: true,
      articlesTitle: 'Latest Articles',
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
      headingWeight: 700,
      bodyWeight: 400,
      lineHeight: 1.6,
      letterSpacing: 0,
      textTransform: 'none',
      sectionSpacing: 4,
      elementSpacing: 2,
      contentPadding: 3,
      cardSpacing: 3,
      layoutVariant: 'classic',
      headerAlignment: 'left',
      contentLayout: 'two-column',
      cardStyle: 'elevated',
    };
    setLocalData(defaultData);
    if (onTemplateChange) {
      onTemplateChange(defaultData);
    }
    if (onReset) {
      onReset();
    }
  };

  return (
    <Paper elevation={2} sx={{ p: 3, height: '100%', overflow: 'auto' }}>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h5">
          Template Customization
        </Typography>
        <Box>
          <IconButton onClick={handleReset} title="Reset to defaults">
            <RefreshIcon />
          </IconButton>
        </Box>
      </Box>

      {/* Template Type */}
      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">Template Type</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <FormControl fullWidth>
              <InputLabel>Template Type</InputLabel>
              <Select
                name="templateType"
                value={localData.templateType || 'front_page'}
                onChange={(e) => handleChange('templateType', e.target.value)}
                label="Template Type"
              >
                <MenuItem value="front_page">Front Page</MenuItem>
                <MenuItem value="content_page">Content Page</MenuItem>
                <MenuItem value="archive_page">Archive Page</MenuItem>
                <MenuItem value="custom">Custom</MenuItem>
              </Select>
              <FormHelperText>Choose the type of template</FormHelperText>
            </FormControl>
          </Box>
        </AccordionDetails>
      </Accordion>

      {/* Basic Information */}
      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <FormatSizeIcon color="primary" />
            <Typography variant="h6">Basic Information</Typography>
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Site Title"
                value={localData.siteTitle}
                onChange={(e) => handleChange('siteTitle', e.target.value)}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Site Subtitle"
                value={localData.siteSubtitle}
                onChange={(e) => handleChange('siteSubtitle', e.target.value)}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={localData.showMission}
                    onChange={(e) => handleChange('showMission', e.target.checked)}
                  />
                }
                label="Show Mission Statement"
              />
            </Grid>
            {localData.showMission && (
              <>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Mission Title"
                    value={localData.missionTitle}
                    onChange={(e) => handleChange('missionTitle', e.target.value)}
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    multiline
                    rows={3}
                    label="Mission Text"
                    value={localData.missionText}
                    onChange={(e) => handleChange('missionText', e.target.value)}
                    variant="outlined"
                  />
                </Grid>
              </>
            )}
          </Grid>
        </AccordionDetails>
      </Accordion>

      {/* Content Settings */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <ViewModuleIcon color="primary" />
            <Typography variant="h6">Content Settings</Typography>
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Articles Section Title"
                value={localData.articlesTitle}
                onChange={(e) => handleChange('articlesTitle', e.target.value)}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12}>
              <Typography gutterBottom>Number of Articles to Display</Typography>
              <Slider
                value={localData.maxArticles}
                onChange={(e, value) => handleChange('maxArticles', value)}
                min={1}
                max={10}
                marks
                valueLabelDisplay="auto"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Photo Books Section Title"
                value={localData.photoBooksTitle}
                onChange={(e) => handleChange('photoBooksTitle', e.target.value)}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12}>
              <Typography gutterBottom>Number of Photo Books to Display</Typography>
              <Slider
                value={localData.maxPhotoBooks}
                onChange={(e, value) => handleChange('maxPhotoBooks', value)}
                min={1}
                max={6}
                marks
                valueLabelDisplay="auto"
              />
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>

      {/* Layout Options */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <DashboardIcon color="primary" />
            <Typography variant="h6">Layout Options</Typography>
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Layout Variant</InputLabel>
                <Select
                  value={localData.layoutVariant || 'classic'}
                  onChange={(e) => handleChange('layoutVariant', e.target.value)}
                  label="Layout Variant"
                >
                  <MenuItem value="classic">Classic</MenuItem>
                  <MenuItem value="modern">Modern</MenuItem>
                  <MenuItem value="minimal">Minimal</MenuItem>
                  <MenuItem value="magazine">Magazine</MenuItem>
                  <MenuItem value="portfolio">Portfolio</MenuItem>
                </Select>
                <FormHelperText>Choose the overall layout style</FormHelperText>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <Typography gutterBottom>Header Alignment</Typography>
              <ToggleButtonGroup
                value={localData.headerAlignment || 'left'}
                exclusive
                onChange={(e, value) => value && handleChange('headerAlignment', value)}
                aria-label="header alignment"
                fullWidth
              >
                <ToggleButton value="left" aria-label="left aligned">
                  <FormatAlignLeftIcon />
                </ToggleButton>
                <ToggleButton value="center" aria-label="centered">
                  <FormatAlignCenterIcon />
                </ToggleButton>
                <ToggleButton value="right" aria-label="right aligned">
                  <FormatAlignRightIcon />
                </ToggleButton>
              </ToggleButtonGroup>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Content Layout</InputLabel>
                <Select
                  value={localData.contentLayout || 'two-column'}
                  onChange={(e) => handleChange('contentLayout', e.target.value)}
                  label="Content Layout"
                >
                  <MenuItem value="single-column">Single Column</MenuItem>
                  <MenuItem value="two-column">Two Column (70/30)</MenuItem>
                  <MenuItem value="three-column">Three Column</MenuItem>
                  <MenuItem value="grid">Grid Layout</MenuItem>
                  <MenuItem value="masonry">Masonry Layout</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Card Style</InputLabel>
                <Select
                  value={localData.cardStyle || 'elevated'}
                  onChange={(e) => handleChange('cardStyle', e.target.value)}
                  label="Card Style"
                >
                  <MenuItem value="flat">Flat</MenuItem>
                  <MenuItem value="elevated">Elevated</MenuItem>
                  <MenuItem value="outlined">Outlined</MenuItem>
                  <MenuItem value="neumorphic">Neumorphic</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>

      {/* Typography */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <TextFieldsIcon color="primary" />
            <Typography variant="h6">Typography</Typography>
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Heading Font</InputLabel>
                <Select
                  value={localData.headingFont || 'Roboto'}
                  onChange={(e) => handleChange('headingFont', e.target.value)}
                  label="Heading Font"
                >
                  <MenuItem value="Roboto">Roboto</MenuItem>
                  <MenuItem value="Open Sans">Open Sans</MenuItem>
                  <MenuItem value="Lato">Lato</MenuItem>
                  <MenuItem value="Montserrat">Montserrat</MenuItem>
                  <MenuItem value="Playfair Display">Playfair Display</MenuItem>
                  <MenuItem value="Raleway">Raleway</MenuItem>
                  <MenuItem value="Poppins">Poppins</MenuItem>
                  <MenuItem value="Inter">Inter</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Body Font</InputLabel>
                <Select
                  value={localData.bodyFont || 'Open Sans'}
                  onChange={(e) => handleChange('bodyFont', e.target.value)}
                  label="Body Font"
                >
                  <MenuItem value="Roboto">Roboto</MenuItem>
                  <MenuItem value="Open Sans">Open Sans</MenuItem>
                  <MenuItem value="Lato">Lato</MenuItem>
                  <MenuItem value="Source Sans Pro">Source Sans Pro</MenuItem>
                  <MenuItem value="Merriweather">Merriweather</MenuItem>
                  <MenuItem value="Georgia">Georgia</MenuItem>
                  <MenuItem value="Inter">Inter</MenuItem>
                  <MenuItem value="Nunito">Nunito</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <Typography gutterBottom>Base Font Size (px)</Typography>
              <Slider
                value={localData.baseFontSize || 16}
                onChange={(e, value) => handleChange('baseFontSize', value)}
                min={12}
                max={24}
                marks
                valueLabelDisplay="auto"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography gutterBottom>Heading Weight</Typography>
              <Slider
                value={localData.headingWeight || 700}
                onChange={(e, value) => handleChange('headingWeight', value)}
                min={100}
                max={900}
                step={100}
                marks
                valueLabelDisplay="auto"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography gutterBottom>Body Weight</Typography>
              <Slider
                value={localData.bodyWeight || 400}
                onChange={(e, value) => handleChange('bodyWeight', value)}
                min={100}
                max={900}
                step={100}
                marks
                valueLabelDisplay="auto"
              />
            </Grid>
            <Grid item xs={12}>
              <Typography gutterBottom>Line Height</Typography>
              <Slider
                value={localData.lineHeight || 1.6}
                onChange={(e, value) => handleChange('lineHeight', value)}
                min={1}
                max={2.5}
                step={0.1}
                marks
                valueLabelDisplay="auto"
              />
            </Grid>
            <Grid item xs={12}>
              <Typography gutterBottom>Letter Spacing (em)</Typography>
              <Slider
                value={localData.letterSpacing || 0}
                onChange={(e, value) => handleChange('letterSpacing', value)}
                min={-0.05}
                max={0.2}
                step={0.01}
                marks
                valueLabelDisplay="auto"
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Text Transform</InputLabel>
                <Select
                  value={localData.textTransform || 'none'}
                  onChange={(e) => handleChange('textTransform', e.target.value)}
                  label="Text Transform"
                >
                  <MenuItem value="none">None</MenuItem>
                  <MenuItem value="uppercase">UPPERCASE</MenuItem>
                  <MenuItem value="lowercase">lowercase</MenuItem>
                  <MenuItem value="capitalize">Capitalize</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>

      {/* Spacing */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <SpaceBarIcon color="primary" />
            <Typography variant="h6">Spacing</Typography>
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography gutterBottom>Section Spacing</Typography>
              <Slider
                value={localData.sectionSpacing || 4}
                onChange={(e, value) => handleChange('sectionSpacing', value)}
                min={1}
                max={10}
                marks
                valueLabelDisplay="auto"
              />
            </Grid>
            <Grid item xs={12}>
              <Typography gutterBottom>Element Spacing</Typography>
              <Slider
                value={localData.elementSpacing || 2}
                onChange={(e, value) => handleChange('elementSpacing', value)}
                min={0.5}
                max={5}
                step={0.5}
                marks
                valueLabelDisplay="auto"
              />
            </Grid>
            <Grid item xs={12}>
              <Typography gutterBottom>Content Padding</Typography>
              <Slider
                value={localData.contentPadding || 3}
                onChange={(e, value) => handleChange('contentPadding', value)}
                min={1}
                max={8}
                marks
                valueLabelDisplay="auto"
              />
            </Grid>
            <Grid item xs={12}>
              <Typography gutterBottom>Card Spacing</Typography>
              <Slider
                value={localData.cardSpacing || 3}
                onChange={(e, value) => handleChange('cardSpacing', value)}
                min={0}
                max={6}
                marks
                valueLabelDisplay="auto"
              />
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>

      {/* Styling */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <ColorLensIcon color="primary" />
            <Typography variant="h6">Colors & Styling</Typography>
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Typography gutterBottom>Primary Color</Typography>
              <ColorInput
                value={localData.primaryColor}
                onChange={(color) => handleChange('primaryColor', color)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography gutterBottom>Secondary Color</Typography>
              <ColorInput
                value={localData.secondaryColor}
                onChange={(color) => handleChange('secondaryColor', color)}
              />
            </Grid>
            <Grid item xs={12}>
              <Typography gutterBottom>Banner Height (px)</Typography>
              <Slider
                value={localData.bannerHeight}
                onChange={(e, value) => handleChange('bannerHeight', value)}
                min={200}
                max={600}
                step={50}
                marks
                valueLabelDisplay="auto"
              />
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>

      {/* Banner Image */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <ImageIcon color="primary" />
            <Typography variant="h6">Banner Image</Typography>
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          <Box>
            <input
              accept="image/*"
              style={{ display: 'none' }}
              id="banner-image-upload"
              type="file"
              onChange={handleImageUpload}
            />
            <label htmlFor="banner-image-upload">
              <Button
                variant="outlined"
                component="span"
                startIcon={<CloudUploadIcon />}
                fullWidth
              >
                Upload Banner Image
              </Button>
            </label>
            {localData.bannerImage && (
              <Box sx={{ mt: 2 }}>
                <img 
                  src={localData.bannerImage} 
                  alt="Banner preview" 
                  style={{ 
                    width: '100%', 
                    height: '150px', 
                    objectFit: 'cover',
                    borderRadius: '4px'
                  }} 
                />
                <Button
                  size="small"
                  onClick={() => handleChange('bannerImage', null)}
                  sx={{ mt: 1 }}
                >
                  Remove Image
                </Button>
              </Box>
            )}
          </Box>
        </AccordionDetails>
      </Accordion>

      <Divider sx={{ my: 3 }} />

      {/* Save Button */}
      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
        <Button 
          variant="outlined" 
          onClick={handleReset}
        >
          Reset
        </Button>
        <Button 
          variant="contained" 
          onClick={() => onSave && onSave(localData)}
          disabled={isSaving}
        >
          {isSaving ? 'Saving...' : 'Save Template'}
        </Button>
      </Box>
    </Paper>
  );
};

export default TemplateCustomizer;
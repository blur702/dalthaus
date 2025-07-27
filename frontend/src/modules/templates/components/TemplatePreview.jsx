import React from 'react';
import { Box, Typography, Button, Card, CardContent, Link, Container } from '@mui/material';
import { Article as ArticleIcon, PhotoLibrary as PhotoIcon } from '@mui/icons-material';

const TemplatePreview = ({ settings = {}, previewMode = 'desktop' }) => {
  // Extract settings with defaults
  const {
    // Typography
    primaryFont = 'Roboto',
    secondaryFont = 'Open Sans',
    baseFontSize = 16,
    fontScale = 1.25,
    headingWeight = 700,
    bodyWeight = 400,
    lineHeight = 1.6,
    letterSpacing = 0,
    paragraphSpacing = 1,
    
    // Colors
    primaryColor = '#1976d2',
    secondaryColor = '#dc004e',
    textColor = '#333333',
    backgroundColor = '#ffffff',
    surfaceColor = '#f5f5f5',
    errorColor = '#f44336',
    warningColor = '#ff9800',
    infoColor = '#2196f3',
    successColor = '#4caf50',
    
    // Body Settings
    bodyBackgroundColor = '#ffffff',
    bodyTextColor = '#333333',
    bodyLinkColor = '#1976d2',
    bodyLinkHoverColor = '#115293',
    
    // Heading Styles
    h1 = { size: 2.5, weight: 700, lineHeight: 1.2, letterSpacing: -0.02, color: null },
    h2 = { size: 2, weight: 700, lineHeight: 1.3, letterSpacing: -0.01, color: null },
    h3 = { size: 1.75, weight: 600, lineHeight: 1.4, letterSpacing: 0, color: null },
    h4 = { size: 1.5, weight: 600, lineHeight: 1.4, letterSpacing: 0, color: null },
    h5 = { size: 1.25, weight: 500, lineHeight: 1.5, letterSpacing: 0, color: null },
    h6 = { size: 1, weight: 500, lineHeight: 1.5, letterSpacing: 0, color: null },
    
    // Spacing
    containerMaxWidth = 1200,
    containerPadding = 24,
    sectionSpacing = 80,
    elementSpacing = 24,
    componentSpacing = 16,
    
    // Border & Effects
    borderRadius = 4,
    borderColor = '#e0e0e0',
    borderWidth = 1,
    boxShadow = '0px 2px 4px rgba(0,0,0,0.1)',
  } = settings;

  // Calculate responsive width based on preview mode
  const getPreviewWidth = () => {
    switch (previewMode) {
      case 'mobile': return '375px';
      case 'tablet': return '768px';
      case 'desktop': return '100%';
      default: return '100%';
    }
  };

  // Style object for preview container
  const previewStyles = {
    width: getPreviewWidth(),
    margin: '0 auto',
    backgroundColor: bodyBackgroundColor,
    color: bodyTextColor,
    fontFamily: secondaryFont,
    fontSize: `${baseFontSize}px`,
    lineHeight: lineHeight,
    letterSpacing: `${letterSpacing}em`,
    minHeight: '100%',
    transition: 'all 0.3s ease',
  };

  // Heading style generator
  const getHeadingStyle = (level) => {
    const headingConfig = settings[level] || {};
    return {
      fontFamily: primaryFont,
      fontSize: `${headingConfig.size}rem`,
      fontWeight: headingConfig.weight,
      lineHeight: headingConfig.lineHeight,
      letterSpacing: `${headingConfig.letterSpacing}em`,
      color: headingConfig.color || textColor,
      marginBottom: `${paragraphSpacing}em`,
    };
  };

  return (
    <Box sx={{ 
      height: '100%', 
      overflow: 'auto',
      backgroundColor: '#f0f0f0',
      p: 2,
    }}>
      <Box sx={previewStyles}>
        {/* Header */}
        <Box
          sx={{
            backgroundColor: primaryColor,
            color: 'white',
            p: containerPadding / 8,
            mb: sectionSpacing / 16,
          }}
        >
          <Container maxWidth={false} sx={{ maxWidth: `${containerMaxWidth}px` }}>
            <Typography 
              variant="h1" 
              sx={{
                ...getHeadingStyle('h1'),
                color: 'white',
                mb: 2,
              }}
            >
              Your Site Title
            </Typography>
            <Typography sx={{ fontFamily: secondaryFont, opacity: 0.9 }}>
              Experience the perfect blend of design and functionality
            </Typography>
          </Container>
        </Box>

        {/* Navigation */}
        <Box
          sx={{
            backgroundColor: textColor,
            color: 'white',
            p: 1,
            mb: sectionSpacing / 16,
          }}
        >
          <Container maxWidth={false} sx={{ maxWidth: `${containerMaxWidth}px` }}>
            <Box sx={{ display: 'flex', gap: 3 }}>
              {['Home', 'Articles', 'Photo Books', 'About', 'Contact'].map((item) => (
                <Link
                  key={item}
                  href="#"
                  sx={{
                    color: 'white',
                    textDecoration: 'none',
                    fontFamily: secondaryFont,
                    '&:hover': {
                      textDecoration: 'underline',
                    },
                  }}
                  onClick={(e) => e.preventDefault()}
                >
                  {item}
                </Link>
              ))}
            </Box>
          </Container>
        </Box>

        {/* Main Content */}
        <Container 
          maxWidth={false} 
          sx={{ 
            maxWidth: `${containerMaxWidth}px`,
            px: `${containerPadding}px`,
            py: `${sectionSpacing / 16}px`,
          }}
        >
          {/* Hero Section */}
          <Box sx={{ mb: sectionSpacing / 16 }}>
            <Typography sx={getHeadingStyle('h2')}>
              Welcome to Our Platform
            </Typography>
            <Typography sx={{ mb: elementSpacing / 16 }}>
              This is a preview of your template with your custom design settings applied in real-time. 
              As you adjust the settings on the left, you'll see the changes reflected here instantly.
            </Typography>
            <Button
              variant="contained"
              sx={{
                backgroundColor: primaryColor,
                color: 'white',
                borderRadius: `${borderRadius}px`,
                textTransform: 'none',
                fontFamily: secondaryFont,
                px: 3,
                py: 1,
                boxShadow: boxShadow,
                '&:hover': {
                  backgroundColor: primaryColor,
                  filter: 'brightness(0.9)',
                },
              }}
            >
              Get Started
            </Button>
          </Box>

          {/* Content Cards */}
          <Box sx={{ mb: sectionSpacing / 16 }}>
            <Typography sx={{ ...getHeadingStyle('h3'), mb: componentSpacing / 16 }}>
              Featured Content
            </Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: componentSpacing / 8 }}>
              {/* Article Card */}
              <Card sx={{
                borderRadius: `${borderRadius}px`,
                border: `${borderWidth}px solid ${borderColor}`,
                boxShadow: boxShadow,
                backgroundColor: surfaceColor,
              }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <ArticleIcon sx={{ color: primaryColor, mr: 1 }} />
                    <Typography sx={getHeadingStyle('h4')}>
                      Latest Article
                    </Typography>
                  </Box>
                  <Typography sx={{ mb: 2 }}>
                    Discover our latest insights and updates in this comprehensive article about modern web design trends.
                  </Typography>
                  <Link
                    href="#"
                    sx={{
                      color: bodyLinkColor,
                      fontFamily: secondaryFont,
                      '&:hover': {
                        color: bodyLinkHoverColor,
                      },
                    }}
                    onClick={(e) => e.preventDefault()}
                  >
                    Read More →
                  </Link>
                </CardContent>
              </Card>

              {/* Photo Book Card */}
              <Card sx={{
                borderRadius: `${borderRadius}px`,
                border: `${borderWidth}px solid ${borderColor}`,
                boxShadow: boxShadow,
                backgroundColor: surfaceColor,
              }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <PhotoIcon sx={{ color: secondaryColor, mr: 1 }} />
                    <Typography sx={getHeadingStyle('h4')}>
                      Photo Gallery
                    </Typography>
                  </Box>
                  <Typography sx={{ mb: 2 }}>
                    Explore our stunning collection of photographs capturing moments from around the world.
                  </Typography>
                  <Link
                    href="#"
                    sx={{
                      color: bodyLinkColor,
                      fontFamily: secondaryFont,
                      '&:hover': {
                        color: bodyLinkHoverColor,
                      },
                    }}
                    onClick={(e) => e.preventDefault()}
                  >
                    View Gallery →
                  </Link>
                </CardContent>
              </Card>
            </Box>
          </Box>

          {/* Typography Examples */}
          <Box sx={{ mb: sectionSpacing / 16 }}>
            <Typography sx={getHeadingStyle('h3')}>
              Typography Scale
            </Typography>
            <Box sx={{ mb: elementSpacing / 16 }}>
              <Typography sx={getHeadingStyle('h1')}>Heading 1</Typography>
              <Typography sx={getHeadingStyle('h2')}>Heading 2</Typography>
              <Typography sx={getHeadingStyle('h3')}>Heading 3</Typography>
              <Typography sx={getHeadingStyle('h4')}>Heading 4</Typography>
              <Typography sx={getHeadingStyle('h5')}>Heading 5</Typography>
              <Typography sx={getHeadingStyle('h6')}>Heading 6</Typography>
              <Typography sx={{ mt: 2 }}>
                Body text with your selected font family ({secondaryFont}), size ({baseFontSize}px), 
                and line height ({lineHeight}). This paragraph demonstrates how your content will 
                appear with the current typography settings.
              </Typography>
            </Box>
          </Box>

          {/* Color Palette */}
          <Box sx={{ mb: sectionSpacing / 16 }}>
            <Typography sx={getHeadingStyle('h3')}>
              Color Palette
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              {[
                { name: 'Primary', color: primaryColor },
                { name: 'Secondary', color: secondaryColor },
                { name: 'Success', color: successColor },
                { name: 'Warning', color: warningColor },
                { name: 'Error', color: errorColor },
                { name: 'Info', color: infoColor },
              ].map(({ name, color }) => (
                <Box key={name} sx={{ textAlign: 'center' }}>
                  <Box
                    sx={{
                      width: 60,
                      height: 60,
                      backgroundColor: color,
                      borderRadius: `${borderRadius}px`,
                      boxShadow: boxShadow,
                      mb: 1,
                    }}
                  />
                  <Typography variant="caption">{name}</Typography>
                </Box>
              ))}
            </Box>
          </Box>
        </Container>

        {/* Footer */}
        <Box
          sx={{
            backgroundColor: textColor,
            color: 'white',
            p: containerPadding / 8,
            mt: sectionSpacing / 16,
          }}
        >
          <Container maxWidth={false} sx={{ maxWidth: `${containerMaxWidth}px` }}>
            <Typography sx={{ fontFamily: secondaryFont, textAlign: 'center' }}>
              © 2024 Your Site. All rights reserved.
            </Typography>
          </Container>
        </Box>
      </Box>
    </Box>
  );
};

export default TemplatePreview;
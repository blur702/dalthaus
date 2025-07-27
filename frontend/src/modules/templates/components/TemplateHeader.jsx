import React from 'react';
import {
  Box,
  Container,
  Typography,
  AppBar,
  Toolbar,
  Button,
  IconButton,
  Menu,
  MenuItem,
  useTheme,
  alpha,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  Menu as MenuIcon,
  Close as CloseIcon,
} from '@mui/icons-material';

// Styled components
const HeaderWrapper = styled(Box)(({ theme, variant, bannerImage, backgroundColor }) => {
  if (variant === 'banner') {
    return {
      background: bannerImage 
        ? `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url(${bannerImage})`
        : backgroundColor || `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      minHeight: '350px',
      color: 'white',
      display: 'flex',
      alignItems: 'center',
      padding: theme.spacing(6, 0),
    };
  }
  
  return {
    backgroundColor: backgroundColor || theme.palette.primary.main,
    color: 'white',
  };
});

const NavigationBar = styled(AppBar)(({ theme, navStyle }) => ({
  backgroundColor: navStyle?.backgroundColor || theme.palette.grey[900],
  color: navStyle?.textColor || 'white',
  position: 'relative',
  boxShadow: theme.shadows[2],
}));

const NavLink = styled(Button)(({ theme }) => ({
  color: 'inherit',
  textTransform: 'none',
  fontSize: '1rem',
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.1),
  },
}));

const SiteTitle = styled(Box)(({ theme }) => ({
  background: alpha(theme.palette.common.white, 0.1),
  padding: theme.spacing(3),
  borderRadius: theme.shape.borderRadius,
  backdropFilter: 'blur(10px)',
}));

const TemplateHeader = ({ 
  templateData = {},
  navigation = [],
  isPreview = false,
}) => {
  const theme = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  
  const {
    // Header settings
    headerVariant = 'banner', // 'banner' or 'navbar'
    siteTitle = 'Your Site Title',
    siteSubtitle = 'Your tagline here',
    logoUrl = null,
    bannerImage = null,
    headerBackgroundColor = theme.palette.primary.main,
    
    // Navigation settings
    showNavigation = true,
    navPosition = 'below', // 'above', 'below', 'overlay'
    navStyle = {
      backgroundColor: theme.palette.grey[900],
      textColor: 'white',
    },
    
    // Mission statement (for banner variant)
    showMission = true,
    missionTitle = 'Your Mission Statement',
    missionText = 'Describe your mission and vision here...',
  } = templateData;

  // Default navigation items for preview
  const defaultNavigation = [
    { label: 'Home', href: '/' },
    { label: 'Articles', href: '/articles' },
    { label: 'Photo Books', href: '/photobooks' },
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
  ];
  
  const navItems = isPreview ? defaultNavigation : navigation;

  const handleMobileMenuToggle = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const renderNavigation = () => (
    <NavigationBar position="static" navStyle={navStyle} elevation={0}>
      <Toolbar>
        <Container maxWidth="lg" sx={{ display: 'flex', alignItems: 'center' }}>
          {/* Logo/Title for navbar variant */}
          {headerVariant === 'navbar' && (
            <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
              {logoUrl ? (
                <img src={logoUrl} alt={siteTitle} style={{ height: 40, marginRight: 16 }} />
              ) : (
                <Typography variant="h6" component="div">
                  {siteTitle}
                </Typography>
              )}
            </Box>
          )}
          
          {/* Desktop Navigation */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, flexGrow: headerVariant === 'banner' ? 1 : 0 }}>
            {navItems.map((item, index) => (
              <NavLink key={index} href={item.href}>
                {item.label}
              </NavLink>
            ))}
          </Box>
          
          {/* Mobile Menu Button */}
          <IconButton
            sx={{ display: { xs: 'flex', md: 'none' } }}
            onClick={handleMobileMenuToggle}
            color="inherit"
          >
            {mobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
          </IconButton>
        </Container>
      </Toolbar>
      
      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <Box sx={{ display: { xs: 'block', md: 'none' } }}>
          <Container maxWidth="lg">
            {navItems.map((item, index) => (
              <MenuItem key={index} onClick={handleMobileMenuToggle}>
                <Typography textAlign="center">{item.label}</Typography>
              </MenuItem>
            ))}
          </Container>
        </Box>
      )}
    </NavigationBar>
  );

  if (headerVariant === 'navbar') {
    return renderNavigation();
  }

  // Banner variant
  return (
    <>
      {showNavigation && navPosition === 'above' && renderNavigation()}
      
      <HeaderWrapper 
        variant={headerVariant} 
        bannerImage={bannerImage}
        backgroundColor={headerBackgroundColor}
      >
        <Container maxWidth="lg">
          <Box sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column', md: 'row' },
            gap: 4,
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
            <Box sx={{ flex: 1, textAlign: { xs: 'center', md: 'left' } }}>
              <SiteTitle>
                {logoUrl && (
                  <Box sx={{ mb: 2 }}>
                    <img src={logoUrl} alt={siteTitle} style={{ maxHeight: 60 }} />
                  </Box>
                )}
                <Typography 
                  variant="h2" 
                  component="h1" 
                  sx={{ fontWeight: 'bold', mb: 1 }}
                >
                  {siteTitle}
                </Typography>
                <Typography variant="h5" sx={{ opacity: 0.9 }}>
                  {siteSubtitle}
                </Typography>
              </SiteTitle>
            </Box>
            
            {showMission && (
              <Box sx={{ flex: 1, maxWidth: { xs: '100%', md: '500px' } }}>
                <Box sx={{
                  background: alpha(theme.palette.common.white, 0.1),
                  padding: theme.spacing(3),
                  borderRadius: theme.shape.borderRadius,
                  backdropFilter: 'blur(10px)',
                }}>
                  <Typography variant="h4" sx={{ mb: 2 }}>
                    {missionTitle}
                  </Typography>
                  <Typography variant="body1" sx={{ lineHeight: 1.6 }}>
                    {missionText}
                  </Typography>
                </Box>
              </Box>
            )}
          </Box>
          
          {showNavigation && navPosition === 'overlay' && (
            <Box sx={{ mt: 4 }}>
              {renderNavigation()}
            </Box>
          )}
        </Container>
      </HeaderWrapper>
      
      {showNavigation && navPosition === 'below' && renderNavigation()}
    </>
  );
};

export default TemplateHeader;
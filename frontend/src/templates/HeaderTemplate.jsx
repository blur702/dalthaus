import React from 'react';
import {
  Box,
  Container,
  Typography,
  AppBar,
  Toolbar,
  Link,
  Button,
  IconButton,
  Menu,
  MenuItem,
  useTheme,
  useMediaQuery,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from '@mui/material';
import { Menu as MenuIcon, Close as CloseIcon } from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { useSiteSettings } from '../contexts/SiteSettingsContext';
import SafeHTML from '../components/SafeHTML';

// Styled components
const HeaderWrapper = styled(Box)(({ theme }) => ({
  width: '100vw',
  position: 'relative',
  left: '50%',
  right: '50%',
  marginLeft: '-50vw',
  marginRight: '-50vw',
  backgroundColor: '#e8e8e8',  // Darker background for WCAG AA
}));

const HeaderContentWrapper = styled(Box)(({ theme }) => ({
  width: '100%',
  paddingTop: theme.spacing(3),
  paddingBottom: theme.spacing(2),
}));

const HeaderContainer = styled(Box)(({ theme }) => ({
  maxWidth: '1220px',
  margin: '0 auto',
  paddingLeft: theme.spacing(3),
  paddingRight: theme.spacing(3),
}));

const SiteTitle = styled(Typography)({
  fontFamily: 'Crimson Text, serif',
  color: '#404040',  // Darker grey with 8.46:1 contrast
  fontWeight: 700,
  fontSize: '2rem',
  letterSpacing: '0.02em',
  textTransform: 'uppercase',
  lineHeight: 1,
  marginBottom: '0.25rem',
});

const SiteSubtitle = styled(Typography)({
  fontFamily: 'Crimson Text, serif',
  color: '#666666',  // Lighter grey for subtle motto
  fontStyle: 'italic',
  fontWeight: 400,
  fontSize: '0.875rem',
  lineHeight: 1.15,
  letterSpacing: '0.01em',
});


const MobileMenuButton = styled(IconButton)(({ theme }) => ({
  color: '#404040',  // Darker grey with 8.46:1 contrast
  padding: theme.spacing(1),
  [theme.breakpoints.down('md')]: {
    position: 'fixed',
    bottom: theme.spacing(3),
    right: theme.spacing(3),
    backgroundColor: '#e8e8e8',
    border: '2px solid #404040',
    zIndex: 1200,
    '&:hover': {
      backgroundColor: '#d0d0d0',
    },
  },
}));

const HeaderTemplate = ({ navigation = [] }) => {
  const theme = useTheme();
  const location = useLocation();
  const { settings } = useSiteSettings();
  const [mobileOpen, setMobileOpen] = React.useState(false);

  // Default navigation items if none provided
  const defaultNavigation = [
    { label: 'Home', path: '/' },
    { label: 'Articles', path: '/articles' },
    { label: 'Photo Books', path: '/photobooks' },
  ];

  const navItems = navigation.length > 0 ? navigation : defaultNavigation;

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <Box sx={{ width: 250, height: '100%', backgroundColor: '#e8e8e8' }}>
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'flex-end', 
        p: 2,
      }}>
        <IconButton onClick={handleDrawerToggle} sx={{ color: '#404040' }}>
          <CloseIcon />
        </IconButton>
      </Box>
      <List>
        {navItems.map((item) => (
          <ListItem key={item.path} disablePadding>
            <ListItemButton
              component={RouterLink}
              to={item.path}
              onClick={handleDrawerToggle}
              sx={{
                backgroundColor: location.pathname === item.path ? '#4a4a4a' : 'transparent',
                color: location.pathname === item.path ? '#ffffff' : '#404040',
                '&:hover': {
                  backgroundColor: '#4a4a4a',
                  color: '#ffffff',
                },
              }}
            >
              <ListItemText 
                primary={item.label} 
                primaryTypographyProps={{
                  fontFamily: 'Arimo, Arial, sans-serif',
                  fontSize: '0.875rem',
                  fontWeight: 400,
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase',
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <HeaderWrapper>
      <HeaderContentWrapper>
        <HeaderContainer>
          {/* Site Title and Description with Menu Button */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              width: '100%',
            }}
          >
            {/* Left side - Title and Motto stacked */}
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                flex: 1,
              }}
            >
              <SafeHTML
                html={settings.siteName || 'Photography Portfolio'}
                component={SiteTitle}
                sx={{ fontSize: { xs: '1.75rem', sm: '2rem' } }}
              />
              {settings.siteDescription && (
                <SafeHTML
                  html={settings.siteDescription}
                  component={SiteSubtitle}
                  sx={{ 
                    fontSize: { xs: '0.75rem', sm: '0.875rem' },
                    marginTop: '-2px',
                  }}
                />
              )}
            </Box>
            
            {/* Right side - Hamburger Menu (hidden on mobile, shown on desktop) */}
            <MobileMenuButton
              aria-label="open menu"
              edge="end"
              onClick={handleDrawerToggle}
              sx={{ 
                display: { xs: 'none', md: 'flex' },
                alignSelf: 'center',
              }}
            >
              <MenuIcon />
            </MobileMenuButton>
          </Box>
        </HeaderContainer>
      </HeaderContentWrapper>

      {/* Mobile Menu Button - Fixed at bottom on mobile */}
      <MobileMenuButton
        aria-label="open menu"
        onClick={handleDrawerToggle}
        sx={{ 
          display: { xs: 'flex', md: 'none' }
        }}
      >
        <MenuIcon />
      </MobileMenuButton>

      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        anchor="right"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          '& .MuiDrawer-paper': { 
            boxSizing: 'border-box', 
            width: 250,
          },
        }}
      >
        {drawer}
      </Drawer>
    </HeaderWrapper>
  );
};

export default HeaderTemplate;
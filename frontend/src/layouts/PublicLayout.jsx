import React, { useEffect, useState } from 'react';
import { Outlet, Link as RouterLink, useLocation } from 'react-router-dom';
import { Box, Container, AppBar, Toolbar, Typography, Button, CircularProgress } from '@mui/material';
import { styled } from '@mui/material/styles';
import api from '../services/api';

const StyledAppBar = styled(AppBar)(({ theme, template }) => ({
  backgroundColor: template?.headerSettings?.backgroundColor || theme.palette.primary.main,
  backgroundImage: template?.headerSettings?.backgroundImage ? `url(${template.headerSettings.backgroundImage})` : 'none',
  backgroundSize: template?.headerSettings?.backgroundSize || 'cover',
  backgroundPosition: template?.headerSettings?.backgroundPosition || 'center',
  backgroundRepeat: template?.headerSettings?.backgroundRepeat || 'no-repeat',
  boxShadow: template?.headerSettings?.boxShadow || theme.shadows[2],
  borderBottom: template?.headerSettings?.borderBottom || 'none',
}));

const PublicLayout = () => {
  const location = useLocation();
  const [template, setTemplate] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchActiveTemplate();
  }, []);

  const fetchActiveTemplate = async () => {
    try {
      const response = await api.get('/public/templates/active/front_page');
      setTemplate(response.data.template);
    } catch (error) {
      console.error('Failed to fetch template:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  const config = template?.configuration || {};
  const headerSettings = template?.headerSettings || {};
  const footerSettings = template?.footerSettings || {};
  const layoutSettings = template?.layoutSettings || {};

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Header */}
      <StyledAppBar position={headerSettings.sticky ? 'sticky' : 'static'} template={template}>
        <Toolbar sx={{ 
          minHeight: headerSettings.height || 80,
          px: `${headerSettings.padding?.left || 20}px`,
          py: `${headerSettings.padding?.top || 20}px`,
        }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
            <Typography variant="h4" component="h1" sx={{ 
              color: config.textColor || '#333',
              fontWeight: 'bold' 
            }}>
              {config.siteTitle || 'Site Title'}
            </Typography>
            {config.siteSubtitle && (
              <Typography variant="subtitle1" sx={{ 
                color: config.textColor || '#666',
                fontStyle: 'italic' 
              }}>
                {config.siteSubtitle}
              </Typography>
            )}
          </Box>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button 
              color="inherit" 
              component={RouterLink} 
              to="/admin/login"
              sx={{ textTransform: 'none' }}
            >
              Admin Login
            </Button>
          </Box>
        </Toolbar>
        
        {/* Navigation Menu */}
        {headerSettings.showNavigation !== false && (
          <Toolbar variant="dense" sx={{ 
            backgroundColor: 'rgba(0, 0, 0, 0.1)',
            minHeight: '48px'
          }}>
            <Box sx={{ display: 'flex', gap: 3 }}>
              <Button 
                color="inherit" 
                component={RouterLink} 
                to="/"
                sx={{ 
                  textTransform: 'none',
                  fontWeight: location.pathname === '/' ? 'bold' : 'normal'
                }}
              >
                Home
              </Button>
              <Button 
                color="inherit" 
                component={RouterLink} 
                to="/articles"
                sx={{ 
                  textTransform: 'none',
                  fontWeight: location.pathname.startsWith('/articles') ? 'bold' : 'normal'
                }}
              >
                Articles
              </Button>
              <Button 
                color="inherit" 
                component={RouterLink} 
                to="/photobooks"
                sx={{ 
                  textTransform: 'none',
                  fontWeight: location.pathname.startsWith('/photobooks') ? 'bold' : 'normal'
                }}
              >
                Photo Books
              </Button>
            </Box>
          </Toolbar>
        )}
        
        {headerSettings.showMission !== false && config.missionTitle && (
          <Box sx={{ 
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            px: `${headerSettings.padding?.left || 20}px`,
            py: 2,
          }}>
            <Typography variant="h6" sx={{ color: config.textColor || '#333' }}>
              {config.missionTitle}
            </Typography>
            {config.missionText && (
              <Typography variant="body2" sx={{ color: config.textColor || '#666', mt: 1 }}>
                {config.missionText}
              </Typography>
            )}
          </Box>
        )}
      </StyledAppBar>

      {/* Main Content */}
      <Box component="main" sx={{ flexGrow: 1, bgcolor: config.backgroundColor || '#ffffff' }}>
        <Container maxWidth={layoutSettings.contentWidth || 'lg'} sx={{ py: 4 }}>
          <Outlet context={{ template }} />
        </Container>
      </Box>

      {/* Footer */}
      <Box
        component="footer"
        sx={{
          backgroundColor: footerSettings.backgroundColor || '#2c3e50',
          color: footerSettings.textColor || '#ffffff',
          backgroundImage: footerSettings.backgroundImage ? `url(${footerSettings.backgroundImage})` : 'none',
          backgroundSize: footerSettings.backgroundSize || 'cover',
          backgroundPosition: footerSettings.backgroundPosition || 'center',
          minHeight: footerSettings.height || 200,
          px: `${footerSettings.padding?.left || 20}px`,
          py: `${footerSettings.padding?.top || 40}px`,
        }}
      >
        <Container maxWidth={layoutSettings.contentWidth || 'lg'}>
          <Typography variant="body2" align="center">
            © {new Date().getFullYear()} {config.siteTitle || 'Site Title'}. All rights reserved.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

export default PublicLayout;
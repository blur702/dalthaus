import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Box,
  Container,
  useTheme,
  useMediaQuery,
  Paper
} from '@mui/material';
import { Menu as MenuIcon } from '@mui/icons-material';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const Header = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const location = useLocation();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const menuItems = [
    { label: 'Home', path: '/' },
    { label: 'Articles', path: '/articles' },
    { label: 'Photo Books', path: '/photobooks' },
    { label: 'About', path: '/about' },
  ];

  const handleNavigate = (path) => {
    navigate(path);
    handleMenuClose();
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <>
      {/* Header with banner */}
      <Box
        sx={{
          background: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), #2c2c2c`,
          color: 'white',
          py: 5,
          position: 'relative',
          minHeight: 300,
          backgroundImage: 'url("/images/banner.jpg")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <Container maxWidth="lg">
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexDirection: { xs: 'column', md: 'row' },
              textAlign: { xs: 'center', md: 'left' },
            }}
          >
            <Box sx={{ flex: 1 }}>
              <Paper
                sx={{
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  padding: '10px 20px',
                  display: 'inline-block',
                  mb: 2,
                }}
                elevation={0}
              >
                <Typography variant="caption" sx={{ color: '#ccc' }}>
                  Banner photo
                </Typography>
              </Paper>
              <Typography
                variant="h2"
                component="h1"
                sx={{
                  fontWeight: 'normal',
                  fontSize: { xs: '2rem', md: '3rem' },
                  lineHeight: 1.2,
                  mb: 2,
                  fontFamily: 'Georgia, serif',
                }}
              >
                Don Althaus,
                <br />
                photography
              </Typography>
            </Box>
            <Box
              sx={{
                flex: 1,
                pl: { xs: 0, md: 5 },
                mt: { xs: 3, md: 0 },
              }}
            >
              <Typography
                variant="h5"
                sx={{
                  fontStyle: 'italic',
                  mb: 2,
                  color: '#f0f0f0',
                  fontFamily: 'Georgia, serif',
                }}
              >
                It's all about storytelling...
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  lineHeight: 1.6,
                  color: '#ddd',
                  fontFamily: 'Georgia, serif',
                }}
              >
                Effective storytelling is the heart and soul of photography.
                It's what draws your readers in and it's what keeps your
                reader's attention. (And yes, they are readers...)
              </Typography>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Navigation */}
      <AppBar
        position="sticky"
        sx={{
          backgroundColor: '#1a1a1a',
          boxShadow: 'none',
        }}
      >
        <Container maxWidth="lg">
          <Toolbar sx={{ px: 0 }}>
            {isMobile ? (
              <>
                <Typography
                  variant="h6"
                  sx={{ flexGrow: 1, fontFamily: 'Georgia, serif' }}
                >
                  Navigation
                </Typography>
                <IconButton
                  edge="end"
                  color="inherit"
                  aria-label="menu"
                  onClick={handleMenuOpen}
                >
                  <MenuIcon />
                </IconButton>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleMenuClose}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                  }}
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                >
                  {menuItems.map((item) => (
                    <MenuItem
                      key={item.path}
                      onClick={() => handleNavigate(item.path)}
                      selected={isActive(item.path)}
                    >
                      {item.label}
                    </MenuItem>
                  ))}
                </Menu>
              </>
            ) : (
              <Box sx={{ display: 'flex', width: '100%' }}>
                {menuItems.map((item) => (
                  <Button
                    key={item.path}
                    color="inherit"
                    component={Link}
                    to={item.path}
                    sx={{
                      flex: 1,
                      textTransform: 'none',
                      fontSize: '1rem',
                      py: 1.5,
                      borderRadius: 0,
                      fontFamily: 'Georgia, serif',
                      backgroundColor: isActive(item.path)
                        ? '#333'
                        : 'transparent',
                      '&:hover': {
                        backgroundColor: '#333',
                      },
                    }}
                  >
                    {item.label}
                  </Button>
                ))}
              </Box>
            )}
          </Toolbar>
        </Container>
      </AppBar>
    </>
  );
};

export default Header;
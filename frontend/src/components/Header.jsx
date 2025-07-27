import React, { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Menu,
  MenuItem,
  Box,
  Link,
  Divider,
  IconButton,
  useTheme,
  useMediaQuery,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  Collapse,
} from '@mui/material';
import {
  Menu as MenuIcon,
  ExpandLess,
  ExpandMore,
  Launch as LaunchIcon,
  Logout as LogoutIcon,
} from '@mui/icons-material';

const Header = ({ setIsAuthenticated }) => {
  const [anchorElContent, setAnchorElContent] = useState(null);
  const [anchorElSettings, setAnchorElSettings] = useState(null);
  const [anchorElTemplates, setAnchorElTemplates] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileContentOpen, setMobileContentOpen] = useState(false);
  const [mobileSettingsOpen, setMobileSettingsOpen] = useState(false);
  const [mobileTemplatesOpen, setMobileTemplatesOpen] = useState(false);
  
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    navigate('/login');
  };

  const handleContentMenuOpen = (event) => {
    setAnchorElContent(event.currentTarget);
  };

  const handleSettingsMenuOpen = (event) => {
    setAnchorElSettings(event.currentTarget);
  };

  const handleTemplatesMenuOpen = (event) => {
    setAnchorElTemplates(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorElContent(null);
    setAnchorElSettings(null);
    setAnchorElTemplates(null);
  };

  const handleMobileDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleMobileContentToggle = () => {
    setMobileContentOpen(!mobileContentOpen);
  };

  const handleMobileSettingsToggle = () => {
    setMobileSettingsOpen(!mobileSettingsOpen);
  };

  const handleMobileTemplatesToggle = () => {
    setMobileTemplatesOpen(!mobileTemplatesOpen);
  };

  const contentMenuItems = [
    { label: 'Articles', path: '/admin/content/articles' },
    { label: 'Pages', path: '/admin/content/pages' },
    { label: 'Photo Books', path: '/admin/content/photo-books' },
  ];

  const templatesMenuItems = [
    { label: 'Global Settings', path: '/admin/templates/global-settings' },
    { label: 'Template Management', path: '/admin/templates' },
    { label: 'Template Builder', path: '/admin/templates/builder' },
  ];

  const settingsMenuItems = [
    { label: 'Site Settings', path: '/admin/settings' },
    { label: 'Global Settings', path: '/admin/settings/global' },
    { label: 'TinyMCE Editor', path: '/admin/settings/tinymce' },
    { divider: true },
    { label: 'Manage Users', path: '/admin/users' },
    { label: 'Create New User', path: '/admin/users/create' },
  ];

  // Mobile drawer content
  const drawer = (
    <Box sx={{ width: 250 }}>
      <List>
        <ListItem>
          <ListItemButton component={RouterLink} to="/admin" onClick={handleMobileDrawerToggle}>
            <ListItemText primary="Dashboard" />
          </ListItemButton>
        </ListItem>
        
        <ListItem disablePadding>
          <ListItemButton onClick={handleMobileContentToggle}>
            <ListItemText primary="Content" />
            {mobileContentOpen ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
        </ListItem>
        <Collapse in={mobileContentOpen} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {contentMenuItems.map((item) => (
              <ListItemButton
                key={item.path}
                component={RouterLink}
                to={item.path}
                sx={{ pl: 4 }}
                onClick={handleMobileDrawerToggle}
              >
                <ListItemText primary={item.label} />
              </ListItemButton>
            ))}
          </List>
        </Collapse>

        <ListItem disablePadding>
          <ListItemButton onClick={handleMobileTemplatesToggle}>
            <ListItemText primary="Templates" />
            {mobileTemplatesOpen ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
        </ListItem>
        <Collapse in={mobileTemplatesOpen} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {templatesMenuItems.map((item) => (
              <ListItemButton
                key={item.path}
                component={RouterLink}
                to={item.path}
                sx={{ pl: 4 }}
                onClick={handleMobileDrawerToggle}
              >
                <ListItemText primary={item.label} />
              </ListItemButton>
            ))}
          </List>
        </Collapse>

        <ListItem disablePadding>
          <ListItemButton onClick={handleMobileSettingsToggle}>
            <ListItemText primary="Settings" />
            {mobileSettingsOpen ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
        </ListItem>
        <Collapse in={mobileSettingsOpen} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {settingsMenuItems.map((item, index) => (
              item.divider ? (
                <Divider key={`divider-${index}`} sx={{ my: 1 }} />
              ) : (
                <ListItemButton
                  key={item.path}
                  component={RouterLink}
                  to={item.path}
                  sx={{ pl: 4 }}
                  onClick={handleMobileDrawerToggle}
                >
                  <ListItemText primary={item.label} />
                </ListItemButton>
              )
            ))}
          </List>
        </Collapse>

        <ListItem>
          <ListItemButton
            component="a"
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleMobileDrawerToggle}
          >
            <ListItemText primary="View Public Site" />
            <LaunchIcon fontSize="small" />
          </ListItemButton>
        </ListItem>

        <Divider sx={{ my: 1 }} />

        <ListItem>
          <ListItemButton onClick={handleLogout}>
            <ListItemText primary="Logout" />
            <LogoutIcon fontSize="small" />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <>
      <AppBar position="sticky" elevation={2}>
        <Toolbar>
          {isMobile && (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleMobileDrawerToggle}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
          )}
          
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Admin Panel
          </Typography>

          {!isMobile && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Button
                color="inherit"
                component={RouterLink}
                to="/admin"
              >
                Dashboard
              </Button>

              <Button
                color="inherit"
                onClick={handleContentMenuOpen}
                endIcon={<ExpandMore />}
              >
                Content
              </Button>
              <Menu
                anchorEl={anchorElContent}
                open={Boolean(anchorElContent)}
                onClose={handleMenuClose}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'left',
                }}
              >
                {contentMenuItems.map((item) => (
                  <MenuItem
                    key={item.path}
                    component={RouterLink}
                    to={item.path}
                    onClick={handleMenuClose}
                  >
                    {item.label}
                  </MenuItem>
                ))}
              </Menu>

              <Button
                color="inherit"
                onClick={handleTemplatesMenuOpen}
                endIcon={<ExpandMore />}
              >
                Templates
              </Button>
              <Menu
                anchorEl={anchorElTemplates}
                open={Boolean(anchorElTemplates)}
                onClose={handleMenuClose}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'left',
                }}
              >
                {templatesMenuItems.map((item) => (
                  <MenuItem
                    key={item.path}
                    component={RouterLink}
                    to={item.path}
                    onClick={handleMenuClose}
                  >
                    {item.label}
                  </MenuItem>
                ))}
              </Menu>

              <Button
                color="inherit"
                onClick={handleSettingsMenuOpen}
                endIcon={<ExpandMore />}
              >
                Settings
              </Button>
              <Menu
                anchorEl={anchorElSettings}
                open={Boolean(anchorElSettings)}
                onClose={handleMenuClose}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'left',
                }}
              >
                {settingsMenuItems.map((item, index) => (
                  item.divider ? (
                    <Divider key={`divider-${index}`} />
                  ) : (
                    <MenuItem
                      key={item.path}
                      component={RouterLink}
                      to={item.path}
                      onClick={handleMenuClose}
                    >
                      {item.label}
                    </MenuItem>
                  )
                ))}
              </Menu>

              <Button
                color="inherit"
                component="a"
                href="/"
                target="_blank"
                rel="noopener noreferrer"
                endIcon={<LaunchIcon fontSize="small" />}
              >
                View Public Site
              </Button>

              <Button
                color="inherit"
                onClick={handleLogout}
                startIcon={<LogoutIcon />}
                sx={{
                  ml: 1,
                  border: 1,
                  borderColor: 'rgba(255, 255, 255, 0.5)',
                  '&:hover': {
                    borderColor: 'rgba(255, 255, 255, 0.8)',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  },
                }}
              >
                Logout
              </Button>
            </Box>
          )}
        </Toolbar>
      </AppBar>

      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleMobileDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { 
            boxSizing: 'border-box', 
            width: 250,
            backgroundColor: theme.palette.background.paper,
          },
        }}
      >
        {drawer}
      </Drawer>
    </>
  );
};

export default Header;
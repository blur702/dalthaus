import React from 'react';
import { Outlet } from 'react-router-dom';
import { Box } from '@mui/material';
import HeaderTemplate from '../templates/HeaderTemplate';
import FooterTemplate from '../templates/FooterTemplate';

const PublicLayout = () => {
  // Apply global font styles - WCAG AA compliant colors
  const globalStyles = {
    fontFamily: 'Gelasio, Georgia, serif',
    fontSize: '16px',
    lineHeight: 1.15,
    color: '#404040',          // Darker grey with 8.46:1 contrast
    backgroundColor: '#e8e8e8', // Darker grey background
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', ...globalStyles }}>
      {/* Header */}
      <HeaderTemplate />

      {/* Main Content */}
      <Box component="main" sx={{ flexGrow: 1, bgcolor: '#e8e8e8' }}>
        <Outlet />
      </Box>

      {/* Footer */}
      <FooterTemplate />
    </Box>
  );
};

export default PublicLayout;
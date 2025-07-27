import React from 'react';
import { Box, Container, Typography } from '@mui/material';

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: '#1a1a1a',
        color: '#ccc',
        py: 4,
        mt: 'auto',
      }}
    >
      <Container maxWidth="lg">
        <Typography
          variant="body2"
          align="center"
          sx={{ fontFamily: 'Georgia, serif' }}
        >
          © {new Date().getFullYear()} Don Althaus Photography. All rights reserved.
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;
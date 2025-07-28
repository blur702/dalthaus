import React from 'react';
import {
  Box,
  Container,
  Typography,
  Link,
  Grid,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { Link as RouterLink } from 'react-router-dom';
import { useSiteSettings } from '../contexts/SiteSettingsContext';

// Styled components
const FooterWrapper = styled(Box)(({ theme }) => ({
  width: '100vw',
  position: 'relative',
  left: '50%',
  right: '50%',
  marginLeft: '-50vw',
  marginRight: '-50vw',
  backgroundColor: '#e8e8e8',  // Darker background for WCAG AA
  marginTop: theme.spacing(8),
}));

const FooterContainer = styled(Box)(({ theme }) => ({
  maxWidth: '1220px',
  margin: '0 auto',
  paddingTop: theme.spacing(4),
  paddingBottom: theme.spacing(4),
  paddingLeft: theme.spacing(3),
  paddingRight: theme.spacing(3),
  textAlign: 'center',
}));

const CopyrightText = styled(Typography)({
  fontFamily: 'Gelasio, Georgia, serif',
  color: '#404040',  // Darker grey with 8.46:1 contrast
  fontSize: '0.875rem',
});

const FooterTemplate = () => {
  const { settings } = useSiteSettings();
  const currentYear = new Date().getFullYear();

  return (
    <FooterWrapper>
      <FooterContainer>
        {/* Copyright Bar */}
        <CopyrightText>
          © {currentYear} {settings.siteName || 'Site Name'}. All rights reserved.
        </CopyrightText>
      </FooterContainer>
    </FooterWrapper>
  );
};

export default FooterTemplate;
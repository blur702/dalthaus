import React from 'react';
import {
  Box,
  Container,
  Typography,
  Link,
  useTheme,
} from '@mui/material';
import { styled } from '@mui/material/styles';

const FooterRoot = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.primary.dark,
  color: theme.palette.common.white,
  padding: theme.spacing(3, 0),
  marginTop: 'auto',
}));

const FooterContent = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  flexWrap: 'wrap',
  gap: theme.spacing(2),
  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column',
    textAlign: 'center',
  },
}));

const FooterLinks = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(2),
  [theme.breakpoints.down('sm')]: {
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
}));

const FooterLink = styled(Link)(({ theme }) => ({
  color: theme.palette.grey[400],
  textDecoration: 'none',
  transition: 'color 0.3s',
  '&:hover': {
    color: theme.palette.common.white,
    textDecoration: 'underline',
  },
}));

const Separator = styled(Typography)(({ theme }) => ({
  color: theme.palette.grey[600],
  display: 'inline-block',
  margin: theme.spacing(0, 1),
  [theme.breakpoints.down('sm')]: {
    display: 'none',
  },
}));

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const theme = useTheme();

  return (
    <FooterRoot component="footer">
      <Container maxWidth="lg">
        <FooterContent>
          <Typography
            variant="body2"
            sx={{ color: theme.palette.grey[400] }}
          >
            © {currentYear} Admin Panel. All rights reserved.
          </Typography>
          
          <FooterLinks>
            <FooterLink href="/admin/help">
              Help
            </FooterLink>
            <Separator>|</Separator>
            
            <FooterLink href="/admin/docs">
              Documentation
            </FooterLink>
            <Separator>|</Separator>
            
            <FooterLink href="/admin/support">
              Support
            </FooterLink>
          </FooterLinks>
        </FooterContent>
      </Container>
    </FooterRoot>
  );
};

export default Footer;
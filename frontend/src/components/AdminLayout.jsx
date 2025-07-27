import React from 'react';
import { Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import Header from './Header';
import Footer from './Footer';
import Breadcrumbs from './Breadcrumbs';

// Styled components using Material UI
const LayoutRoot = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  minHeight: '100vh',
  backgroundColor: theme.palette.background.default,
}));

const MainContent = styled(Box)(({ theme }) => ({
  flex: 1,
  paddingTop: theme.spacing(2),
  paddingBottom: theme.spacing(2),
  [theme.breakpoints.down('sm')]: {
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
  },
}));

const ContentContainer = styled(Box)(({ theme }) => ({
  maxWidth: theme.custom.content.maxWidth,
  margin: '0 auto',
  padding: theme.spacing(0, 2),
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(0, 1),
  },
}));

const AdminLayout = ({ children, setIsAuthenticated }) => {
  return (
    <LayoutRoot>
      <Header setIsAuthenticated={setIsAuthenticated} />
      <MainContent component="main">
        <Breadcrumbs />
        <ContentContainer>
          {children}
        </ContentContainer>
      </MainContent>
      <Footer />
    </LayoutRoot>
  );
};

export default AdminLayout;
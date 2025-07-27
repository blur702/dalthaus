import React from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import {
  Breadcrumbs as MuiBreadcrumbs,
  Link,
  Typography,
  Box,
  useTheme,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import HomeIcon from '@mui/icons-material/Home';

const BreadcrumbsContainer = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.grey[100],
  padding: theme.spacing(1.5, 2.5),
  borderBottom: `1px solid ${theme.palette.divider}`,
  marginBottom: theme.spacing(2.5),
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(1.25, 2),
    marginBottom: theme.spacing(2),
  },
}));

const BreadcrumbLink = styled(Link)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(0.5),
  color: theme.palette.info.main,
  textDecoration: 'none',
  fontSize: '0.875rem',
  transition: 'all 0.2s',
  '&:hover': {
    color: theme.palette.info.dark,
    textDecoration: 'underline',
  },
}));

const BreadcrumbText = styled(Typography)(({ theme }) => ({
  fontSize: '0.875rem',
  color: theme.palette.text.primary,
  fontWeight: 500,
}));

const StyledHomeIcon = styled(HomeIcon)(({ theme }) => ({
  fontSize: '1rem',
}));

const Breadcrumbs = () => {
  const location = useLocation();
  const theme = useTheme();
  const pathnames = location.pathname.split('/').filter((x) => x);

  // Map of route segments to user-friendly names
  const breadcrumbNameMap = {
    'admin': 'Dashboard',
    'users': 'Users',
    'user-management': 'User Management',
    'create': 'Create User',
    'content': 'Content',
    'articles': 'Articles',
    'pages': 'Pages',
    'photo-books': 'Photo Books',
    'photobooks': 'Photo Books',
    'settings': 'Settings',
    'site': 'Site Settings',
    'tinymce': 'TinyMCE Configuration',
    'test': 'Testing',
    'templates': 'Templates',
    'builder': 'Template Builder',
    'test-tinymce': 'TinyMCE Test',
    'pagebreak-test': 'Pagebreak Test'
  };

  // Don't show breadcrumbs on the dashboard
  if (pathnames.length === 0 || (pathnames.length === 1 && pathnames[0] === 'admin')) {
    return null;
  }

  return (
    <BreadcrumbsContainer>
      <MuiBreadcrumbs 
        aria-label="breadcrumb"
        separator="/"
        sx={{
          '& .MuiBreadcrumbs-separator': {
            color: theme.palette.grey[400],
            mx: 1.25,
          },
        }}
      >
        <BreadcrumbLink
          component={RouterLink}
          to="/admin"
        >
          <StyledHomeIcon />
          Home
        </BreadcrumbLink>
        
        {pathnames.map((value, index) => {
          const to = `/${pathnames.slice(0, index + 1).join('/')}`;
          const isLast = index === pathnames.length - 1;
          const displayName = breadcrumbNameMap[value] || 
            value.charAt(0).toUpperCase() + value.slice(1).replace(/-/g, ' ');

          return isLast ? (
            <BreadcrumbText key={to}>
              {displayName}
            </BreadcrumbText>
          ) : (
            <BreadcrumbLink
              key={to}
              component={RouterLink}
              to={to}
            >
              {displayName}
            </BreadcrumbLink>
          );
        })}
      </MuiBreadcrumbs>
    </BreadcrumbsContainer>
  );
};

export default Breadcrumbs;
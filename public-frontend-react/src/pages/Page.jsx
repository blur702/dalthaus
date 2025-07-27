import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Paper,
  CircularProgress,
  Alert,
  IconButton,
  Link as MuiLink,
} from '@mui/material';
import { Edit as EditIcon } from '@mui/icons-material';
import { api, isAdminLoggedIn, getEditLink } from '../services/api';

const Page = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [page, setPage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const isAdmin = isAdminLoggedIn();
  const editUrl = page ? getEditLink('page', page.id) : null;

  useEffect(() => {
    if (!id) {
      navigate('/');
      return;
    }

    const fetchPage = async () => {
      try {
        setLoading(true);
        const data = await api.getPage(id);
        setPage(data);
      } catch (err) {
        console.error('Error loading page:', err);
        setError('Page not found or unavailable.');
      } finally {
        setLoading(false);
      }
    };

    fetchPage();
  }, [id, navigate]);

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  if (!page) return null;

  return (
    <Container maxWidth="md" sx={{ py: 5 }}>
      <Paper
        elevation={1}
        sx={{
          p: { xs: 3, md: 5 },
          position: 'relative',
          backgroundColor: 'background.paper',
        }}
      >
        {isAdmin && editUrl && (
          <IconButton
            component={MuiLink}
            href={editUrl}
            target="_blank"
            sx={{
              position: 'absolute',
              top: 16,
              right: 16,
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              border: '1px solid',
              borderColor: 'divider',
              '&:hover': {
                backgroundColor: 'background.paper',
                borderColor: 'action.selected',
              },
            }}
            size="small"
          >
            <EditIcon fontSize="small" />
          </IconButton>
        )}

        <Typography
          variant="h3"
          component="h1"
          gutterBottom
          sx={{
            fontFamily: 'Georgia, serif',
            fontWeight: 'normal',
            mb: 4,
          }}
        >
          {page.title}
        </Typography>

        <Box
          className="page-content"
          sx={{
            '& p': {
              mb: 2.5,
              lineHeight: 1.8,
              fontSize: '1.1rem',
            },
            '& h2, & h3, & h4': {
              mt: 4,
              mb: 2,
              fontFamily: 'Georgia, serif',
            },
            '& img': {
              maxWidth: '100%',
              height: 'auto',
              my: 3,
              borderRadius: 1,
            },
            '& blockquote': {
              borderLeft: '4px solid',
              borderColor: 'primary.main',
              pl: 3,
              my: 3,
              fontStyle: 'italic',
            },
            '& a': {
              color: 'primary.main',
              textDecoration: 'underline',
            },
            '& ul, & ol': {
              mb: 2,
              pl: 3,
            },
            '& li': {
              mb: 0.5,
            },
          }}
          dangerouslySetInnerHTML={{ __html: page.body || '' }}
        />
      </Paper>
    </Container>
  );
};

export default Page;
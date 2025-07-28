import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  CircularProgress,
  Breadcrumbs,
  Link,
  Container
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';
import api from '../../services/api';
import ContentViewer from '../../components/ContentViewer';

const PhotoBookView = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [photoBook, setPhotoBook] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPhotoBook();
  }, [slug]);

  const fetchPhotoBook = async () => {
    try {
      const response = await api.get(`/public/photobooks/${slug}`);
      setPhotoBook(response.data);
    } catch (error) {
      console.error('Failed to fetch photo book:', error);
      if (error.response?.status === 404) {
        navigate('/404');
      }
    } finally {
      setLoading(false);
    }
  };

  const getImageUrl = (url) => {
    if (!url) return null;
    if (url.startsWith('/uploads')) {
      return url;
    }
    return url;
  };


  if (loading) {
    return (
      <Box display="flex" justifyContent="center" py={8}>
        <CircularProgress />
      </Box>
    );
  }

  if (!photoBook) {
    return (
      <Box py={8} textAlign="center">
        <Typography variant="h5" color="text.secondary">
          Photo book not found
        </Typography>
      </Box>
    );
  }

  return (
    <Container maxWidth={false} sx={{ maxWidth: '1220px', py: 4 }}>
      <Box>
        {/* Breadcrumbs */}
        <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 3 }}>
          <Link
            component={RouterLink}
            to="/"
            color="inherit"
            sx={{ display: 'flex', alignItems: 'center' }}
          >
            <HomeIcon sx={{ mr: 0.5 }} fontSize="small" />
            Home
          </Link>
          <Link component={RouterLink} to="/photobooks" color="inherit">
            Photo Books
          </Link>
          <Typography color="text.primary">{photoBook.title}</Typography>
        </Breadcrumbs>

        {/* Photo Book Content */}
        <Box sx={{ p: 4 }}>
        {/* Header */}
        <Box mb={4}>
          <Typography variant="h3" component="h1" gutterBottom>
            {photoBook.title}
          </Typography>
          
          {photoBook.publishedAt && (
            <Typography variant="caption" color="text.secondary" display="block" mb={2}>
              Published: {new Date(photoBook.publishedAt).toLocaleDateString()}
            </Typography>
          )}

          {photoBook.metadata?.description && (
            <Typography variant="subtitle1" color="text.secondary" paragraph>
              {photoBook.metadata.description}
            </Typography>
          )}
        </Box>

        {/* Featured Image */}
        {photoBook.featuredImage && (
          <Box mb={4}>
            <Box position="relative">
              <Box textAlign="center">
                <img
                  src={getImageUrl(photoBook.featuredImage)}
                  alt={photoBook.featuredImageAlt || photoBook.title}
                  style={{
                    width: '100%',
                    height: 'auto',
                    maxHeight: '800px',
                    objectFit: 'contain',
                    display: 'block'
                  }}
                />
              </Box>
              {(photoBook.featuredImageCaption || photoBook.featuredImageCredit || true) && (
                <Box 
                  sx={{ 
                    mt: 1, 
                    px: 1,
                    display: 'flex',
                    flexDirection: { xs: 'column', sm: 'row' },
                    justifyContent: 'space-between',
                    alignItems: { xs: 'flex-start', sm: 'flex-start' },
                    gap: { xs: 0.5, sm: 2 }
                  }}
                >
                  {photoBook.featuredImageCaption && (
                    <Typography 
                      variant="caption" 
                      color="text.secondary"
                      sx={{ 
                        flexGrow: 1,
                        wordBreak: 'break-word'
                      }}
                    >
                      {photoBook.featuredImageCaption}
                    </Typography>
                  )}
                  <Typography 
                    variant="caption" 
                    color="text.secondary"
                    sx={{ 
                      fontStyle: 'italic',
                      minWidth: 'fit-content',
                      flexShrink: 0,
                      textAlign: 'right'
                    }}
                  >
                    {photoBook.featuredImageCredit || 'Don Althaus'}
                  </Typography>
                </Box>
              )}
            </Box>
          </Box>
        )}

        {/* Page Content */}
        <Box 
          className="photobook-content"
          sx={{
            minHeight: '400px',
            '& .content-display': {
              '& img': {
                maxWidth: '100%',
                height: 'auto',
                display: 'block',
                margin: '20px auto',
                borderRadius: '0'
              },
              '& p': {
                marginBottom: '1.5em',
                lineHeight: 1.7
              },
              '& h1, & h2': {
                marginTop: '2em',
                marginBottom: '1em'
              },
              '& h3, & h4': {
                marginTop: '1.5em',
                marginBottom: '0.75em'
              },
              '& blockquote': {
                borderLeft: '4px solid',
                borderColor: 'primary.main',
                paddingLeft: '1.5em',
                marginLeft: 0,
                fontStyle: 'italic',
                color: 'text.secondary'
              }
            },
            '& .content-pagination': {
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: '3rem',
              paddingTop: '2rem',
              borderTop: '1px solid',
              borderColor: 'divider',
              gap: 2,
              '& .pagination-btn': {
                padding: '8px 16px',
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: '0',
                background: 'white',
                cursor: 'pointer',
                transition: 'all 0.2s',
                '&:hover:not(:disabled)': {
                  backgroundColor: 'action.hover',
                  borderColor: 'primary.main'
                },
                '&:disabled': {
                  opacity: 0.5,
                  cursor: 'not-allowed'
                }
              },
              '& .pagination-pages': {
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 1,
                '& .page-info': {
                  fontSize: '0.875rem',
                  color: 'text.secondary'
                },
                '& .page-dots': {
                  display: 'flex',
                  gap: '8px',
                  '& .page-dot': {
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    border: '1px solid',
                    borderColor: 'divider',
                    background: 'white',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    '&.active': {
                      backgroundColor: 'primary.main',
                      borderColor: 'primary.main'
                    },
                    '&:hover:not(.active)': {
                      backgroundColor: 'action.hover'
                    }
                  }
                }
              }
            }
          }}
        >
          <ContentViewer content={photoBook.body} showPagination={true} />
        </Box>
      </Box>
      </Box>
    </Container>
  );
};

export default PhotoBookView;
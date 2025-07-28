import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  CircularProgress,
  Breadcrumbs,
  Link,
  Chip,
  Container
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';
import api from '../../services/api';
import ContentViewer from '../../components/ContentViewer';

const ArticleView = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchArticle();
  }, [slug]);

  const fetchArticle = async () => {
    try {
      const response = await api.get(`/public/articles/${slug}`);
      setArticle(response.data);
    } catch (error) {
      console.error('Failed to fetch article:', error);
      if (error.response?.status === 404) {
        navigate('/404');
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" py={8}>
        <CircularProgress />
      </Box>
    );
  }

  if (!article) {
    return (
      <Box py={8} textAlign="center">
        <Typography variant="h5" color="text.secondary">
          Article not found
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
          <Link component={RouterLink} to="/articles" color="inherit">
            Articles
          </Link>
          <Typography color="text.primary">{article.title}</Typography>
        </Breadcrumbs>

        {/* Article Content */}
        <Box sx={{ p: 4 }}>
        {/* Article Header */}
        <Box mb={4}>
          <Typography variant="h3" component="h1" gutterBottom>
            {article.title}
          </Typography>
          
          <Box display="flex" gap={2} alignItems="center" mb={2}>
            <Typography variant="caption" color="text.secondary">
              Published: {new Date(article.publishedAt).toLocaleDateString()}
            </Typography>
            {article.metadata?.author && (
              <>
                <Typography variant="caption" color="text.secondary">•</Typography>
                <Typography variant="caption" color="text.secondary">
                  By {article.metadata.author}
                </Typography>
              </>
            )}
          </Box>

          {article.metadata?.tags && article.metadata.tags.length > 0 && (
            <Box display="flex" gap={1} flexWrap="wrap">
              {article.metadata.tags.map((tag, index) => (
                <Chip key={index} label={tag} size="small" variant="outlined" />
              ))}
            </Box>
          )}
        </Box>

        {/* Featured Image */}
        {article.featuredImage && (
          <Box mb={4}>
            <Box position="relative">
              <img
                src={article.featuredImage}
                alt={article.featuredImageAlt || article.title}
                style={{
                  width: '100%',
                  height: 'auto',
                  maxHeight: '800px',
                  objectFit: 'contain',
                  display: 'block'
                }}
              />
              {(article.featuredImageCaption || article.featuredImageCredit || true) && (
                <Box 
                  sx={{ 
                    mt: 1,
                    backgroundColor: '#d9d9d9',
                    p: 2,
                    display: 'flex',
                    flexDirection: { xs: 'column', sm: 'row' },
                    justifyContent: 'space-between',
                    alignItems: { xs: 'flex-start', sm: 'flex-start' },
                    gap: { xs: 0.5, sm: 2 },
                    width: '100%'
                  }}
                >
                  {article.featuredImageCaption && (
                    <Typography 
                      sx={{ 
                        fontSize: '1em',
                        color: 'text.secondary',
                        flexGrow: 1,
                        wordBreak: 'break-word'
                      }}
                    >
                      {article.featuredImageCaption}
                    </Typography>
                  )}
                  <Typography 
                    sx={{ 
                      fontSize: '1em',
                      color: 'text.secondary',
                      fontStyle: 'italic',
                      minWidth: 'fit-content',
                      flexShrink: 0,
                      textAlign: 'right'
                    }}
                  >
                    {article.featuredImageCredit || 'Don Althaus'}
                  </Typography>
                </Box>
              )}
            </Box>
          </Box>
        )}

        {/* Article Body */}
        <Box 
          className="article-content"
          sx={{
            '& .content-display': {
              '& img': {
                maxWidth: '100%',
                height: 'auto',
                display: 'block',
                margin: '20px auto'
              },
              '& p': {
                marginBottom: '1.5em',
                lineHeight: 1.7
              },
              '& h2': {
                marginTop: '2em',
                marginBottom: '1em'
              },
              '& h3': {
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
              },
              '& code': {
                backgroundColor: 'grey.100',
                padding: '2px 4px',
                borderRadius: '0',
                fontSize: '0.9em'
              },
              '& pre': {
                backgroundColor: 'grey.100',
                padding: '1em',
                borderRadius: '0',
                overflow: 'auto'
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
          <ContentViewer content={article.body} showPagination={true} />
        </Box>
      </Box>
      </Box>
    </Container>
  );
};

export default ArticleView;
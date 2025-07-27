import React, { useState, useEffect } from 'react';
import { useOutletContext, Link as RouterLink } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  Grid, 
  Card, 
  CardMedia, 
  CardContent, 
  CardActionArea,
  CircularProgress,
  Button,
  Stack,
  Paper
} from '@mui/material';
import { styled } from '@mui/material/styles';
import api from '../../services/api';

const ContentCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'transform 0.2s, box-shadow 0.2s',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: theme.shadows[4],
  }
}));

const TeaserImage = styled(CardMedia)(({ theme }) => ({
  height: 200,
  objectFit: 'cover',
}));

const TemplateBasedHomePage = () => {
  const { template } = useOutletContext();
  const [loading, setLoading] = useState(true);
  const [articles, setArticles] = useState([]);
  const [photoBooks, setPhotoBooks] = useState([]);

  useEffect(() => {
    if (template) {
      fetchContent();
    }
  }, [template]);

  const fetchContent = async () => {
    try {
      const layout = template?.configuration?.layout || {};
      const leftColumn = layout.leftColumn || {};
      const rightColumn = layout.rightColumn || {};

      // Fetch content based on template configuration
      const promises = [];
      
      if (leftColumn.contentType === 'photobooks') {
        promises.push(api.get(`/public/photobooks?limit=${leftColumn.itemsPerPage || 6}`));
      } else if (leftColumn.contentType === 'articles') {
        promises.push(api.get(`/public/articles?limit=${leftColumn.itemsPerPage || 6}`));
      }

      if (rightColumn.contentType === 'articles') {
        promises.push(api.get(`/public/articles?limit=${rightColumn.itemsPerPage || 4}`));
      } else if (rightColumn.contentType === 'photobooks') {
        promises.push(api.get(`/public/photobooks?limit=${rightColumn.itemsPerPage || 4}`));
      }

      const responses = await Promise.all(promises);
      
      // Set content based on template configuration
      if (leftColumn.contentType === 'photobooks') {
        setPhotoBooks(responses[0].data.photobooks || []);
        if (rightColumn.contentType === 'articles') {
          setArticles(responses[1].data.articles || []);
        }
      } else if (leftColumn.contentType === 'articles') {
        setArticles(responses[0].data.articles || []);
        if (rightColumn.contentType === 'photobooks') {
          setPhotoBooks(responses[1].data.photobooks || []);
        }
      }
    } catch (error) {
      console.error('Failed to fetch content:', error);
    } finally {
      setLoading(false);
    }
  };

  const getImageUrl = (content) => {
    // Use teaser image if available, otherwise fall back to featured image
    const imageUrl = content.teaserImage || content.featuredImage;
    if (!imageUrl) return null;
    
    // If it's a relative URL, prepend the backend URL
    if (imageUrl.startsWith('/uploads')) {
      return `http://localhost:5001${imageUrl}`;
    }
    return imageUrl;
  };

  const getSummary = (content) => {
    // Use summary if available, otherwise extract from body
    if (content.summary) return content.summary;
    
    const stripped = content.body.replace(/<[^>]*>/g, '');
    return stripped.length > 150 ? stripped.substring(0, 150) + '...' : stripped;
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" py={8}>
        <CircularProgress />
      </Box>
    );
  }

  const layout = template?.configuration?.layout || {};
  const leftColumn = layout.leftColumn || {};
  const rightColumn = layout.rightColumn || {};

  const renderPhotoBooks = (books, columns = 2) => (
    <Grid container spacing={3}>
      {books.map((book) => (
        <Grid size={{ xs: 12, sm: 6, md: 12 / columns }} key={book.id}>
          <ContentCard>
            <CardActionArea 
              component={RouterLink} 
              to={`/photobooks/${book.slug}`}
              sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}
            >
              {getImageUrl(book) ? (
                <TeaserImage
                  image={getImageUrl(book)}
                  title={book.title}
                  alt={book.teaserImageAlt || book.featuredImageAlt || book.title}
                />
              ) : (
                <Box
                  sx={{
                    height: 200,
                    backgroundColor: 'grey.200',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <Typography variant="h6" color="text.secondary">
                    No Image
                  </Typography>
                </Box>
              )}
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h6" component="h3" gutterBottom>
                  {book.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {getSummary(book)}
                </Typography>
              </CardContent>
            </CardActionArea>
          </ContentCard>
        </Grid>
      ))}
    </Grid>
  );

  const renderArticles = (articles, displayStyle = 'list') => {
    if (displayStyle === 'grid') {
      return (
        <Grid container spacing={2}>
          {articles.map((article) => (
            <Grid size={12} key={article.id}>
              <ContentCard>
                <CardActionArea 
                  component={RouterLink} 
                  to={`/articles/${article.slug}`}
                >
                  <CardContent>
                    <Typography variant="h6" component="h3" gutterBottom>
                      {article.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {getSummary(article)}
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </ContentCard>
            </Grid>
          ))}
        </Grid>
      );
    }

    // List style
    return (
      <Stack spacing={2}>
        {articles.map((article) => (
          <Paper key={article.id} elevation={1}>
            <Box 
              component={RouterLink} 
              to={`/articles/${article.slug}`}
              sx={{ 
                display: 'block',
                textDecoration: 'none',
                color: 'inherit',
                p: 2,
                '&:hover': {
                  backgroundColor: 'action.hover'
                }
              }}
            >
              <Typography variant="h6" component="h3" gutterBottom>
                {article.title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {getSummary(article)}
              </Typography>
              <Typography variant="caption" color="primary" sx={{ mt: 1, display: 'block' }}>
                Read more →
              </Typography>
            </Box>
          </Paper>
        ))}
      </Stack>
    );
  };

  return (
    <Box>
      <Grid container spacing={4}>
        {/* Left Column (2/3) */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Box mb={3}>
            <Typography variant="h4" component="h2" gutterBottom>
              {leftColumn.title || 'Featured Content'}
            </Typography>
          </Box>
          {leftColumn.contentType === 'photobooks' 
            ? renderPhotoBooks(photoBooks, leftColumn.columns || 2)
            : renderArticles(articles, leftColumn.displayStyle || 'grid')
          }
          {leftColumn.contentType === 'photobooks' && photoBooks.length > 0 && (
            <Box mt={3} display="flex" justifyContent="center">
              <Button 
                component={RouterLink} 
                to="/photobooks" 
                variant="outlined"
                color="primary"
              >
                View All Photo Books
              </Button>
            </Box>
          )}
        </Grid>

        {/* Right Column (1/3) */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Box mb={3}>
            <Typography variant="h4" component="h2" gutterBottom>
              {rightColumn.title || 'Latest Updates'}
            </Typography>
          </Box>
          {rightColumn.contentType === 'articles' 
            ? renderArticles(articles, rightColumn.displayStyle || 'list')
            : renderPhotoBooks(photoBooks, 1)
          }
          {rightColumn.contentType === 'articles' && articles.length > 0 && (
            <Box mt={3} display="flex" justifyContent="center">
              <Button 
                component={RouterLink} 
                to="/articles" 
                variant="outlined"
                color="primary"
                size="small"
              >
                View All Articles
              </Button>
            </Box>
          )}
        </Grid>
      </Grid>

      {/* No Content Message */}
      {articles.length === 0 && photoBooks.length === 0 && (
        <Box py={8} textAlign="center">
          <Typography variant="h5" color="text.secondary" gutterBottom>
            No content available yet
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Check back soon for updates!
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default TemplateBasedHomePage;
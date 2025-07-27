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
  Chip
} from '@mui/material';
import api from '../../services/api';

const HomePage = () => {
  const { template } = useOutletContext();
  const [loading, setLoading] = useState(true);
  const [articles, setArticles] = useState([]);
  const [photoBooks, setPhotoBooks] = useState([]);
  const [featuredPages, setFeaturedPages] = useState([]);

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      // Fetch articles and photo books
      const [articlesRes, photoBooksRes] = await Promise.all([
        api.get('/public/articles?limit=6'),
        api.get('/public/photobooks?limit=6')
      ]);

      setArticles(articlesRes.data.articles || []);
      setPhotoBooks(photoBooksRes.data.photobooks || []);
      
      // Try to fetch pages separately to avoid failing everything
      try {
        const pagesRes = await api.get('/public/pages');
        const allPages = pagesRes.data || [];
        const featured = allPages.filter(page => page.metadata?.featured === true).slice(0, 4);
        setFeaturedPages(featured);
      } catch (pageError) {
        console.log('Pages endpoint not available or no pages found');
        setFeaturedPages([]);
      }
    } catch (error) {
      console.error('Failed to fetch content:', error);
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

  return (
    <Box>
      {/* Recent Articles Section */}
      <Box mb={6}>
        <Typography variant="h4" component="h2" gutterBottom>
          Recent Articles
        </Typography>
        <Grid container spacing={3}>
          {articles.map((article) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={article.id}>
              <Card>
                <CardActionArea component={RouterLink} to={`/articles/${article.slug}`}>
                  {article.featuredImage && (
                    <CardMedia
                      component="img"
                      height="200"
                      image={article.featuredImage}
                      alt={article.title}
                    />
                  )}
                  <CardContent>
                    <Typography variant="h6" component="h3" gutterBottom>
                      {article.title}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" display="block" mb={1}>
                      {new Date(article.publishedAt).toLocaleDateString()}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {article.metadata?.excerpt || article.body.substring(0, 150) + '...'}
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>
        {articles.length > 0 && (
          <Box mt={3} display="flex" justifyContent="center">
            <Button 
              component={RouterLink} 
              to="/articles" 
              variant="outlined"
              color="primary"
            >
              View All Articles
            </Button>
          </Box>
        )}
      </Box>

      {/* Photo Books Section */}
      <Box mb={6}>
        <Typography variant="h4" component="h2" gutterBottom>
          Photo Books
        </Typography>
        <Grid container spacing={3}>
          {photoBooks.map((book) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={book.id}>
              <Card>
                <CardActionArea component={RouterLink} to={`/photobooks/${book.slug}`}>
                  {book.featuredImage && (
                    <CardMedia
                      component="img"
                      height="300"
                      image={book.featuredImage}
                      alt={book.title}
                    />
                  )}
                  <CardContent>
                    <Typography variant="h6" component="h3" gutterBottom>
                      {book.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {book.metadata?.description || 'View photo collection'}
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>
        {photoBooks.length > 0 && (
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
      </Box>

      {/* Featured Pages Section */}
      {featuredPages.length > 0 && (
        <Box mb={6}>
          <Typography variant="h4" component="h2" gutterBottom>
            Featured Pages
          </Typography>
          <Grid container spacing={3}>
            {featuredPages.map((page) => (
              <Grid size={{ xs: 12, sm: 6 }} key={page.id}>
                <Card>
                  <CardActionArea component={RouterLink} to={`/pages/${page.slug}`}>
                    <CardContent>
                      <Typography variant="h6" component="h3" gutterBottom>
                        {page.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {page.metadata?.description || 'Learn more →'}
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {/* No Content Message */}
      {articles.length === 0 && photoBooks.length === 0 && featuredPages.length === 0 && (
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

export default HomePage;
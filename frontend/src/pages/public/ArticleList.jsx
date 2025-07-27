import React, { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  Grid, 
  Card, 
  CardMedia, 
  CardContent, 
  CardActionArea,
  CircularProgress,
  Pagination,
  Breadcrumbs,
  Link
} from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import api from '../../services/api';

const ArticleList = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 9;

  useEffect(() => {
    fetchArticles();
  }, [page]);

  const fetchArticles = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/public/articles?page=${page}&limit=${itemsPerPage}`);
      setArticles(response.data.articles || []);
      setTotalPages(response.data.totalPages || 1);
    } catch (error) {
      console.error('Failed to fetch articles:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (event, value) => {
    setPage(value);
    window.scrollTo(0, 0);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Recently published';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getExcerpt = (article) => {
    // Use summary if available
    if (article.summary) return article.summary;
    
    // Fall back to metadata excerpt
    if (article.metadata?.excerpt) return article.metadata.excerpt;
    
    // Finally, strip HTML tags and get first 150 characters
    const stripped = article.body.replace(/<[^>]*>/g, '');
    return stripped.length > 150 ? stripped.substring(0, 150) + '...' : stripped;
  };

  const getImageUrl = (article) => {
    // Use teaser image if available, otherwise fall back to featured image
    const imageUrl = article.teaserImage || article.featuredImage;
    if (!imageUrl) return null;
    
    // If it's a relative URL, prepend the backend URL
    if (imageUrl.startsWith('/uploads')) {
      return `http://localhost:5001${imageUrl}`;
    }
    return imageUrl;
  };

  if (loading && page === 1) {
    return (
      <Box display="flex" justifyContent="center" py={8}>
        <CircularProgress />
      </Box>
    );
  }

  return (
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
        <Typography color="text.primary">Articles</Typography>
      </Breadcrumbs>

      <Typography variant="h3" component="h1" gutterBottom>
        Articles
      </Typography>

      {articles.length === 0 ? (
        <Box py={8} textAlign="center">
          <Typography variant="h5" color="text.secondary">
            No articles found
          </Typography>
        </Box>
      ) : (
        <>
          <Grid container spacing={3} sx={{ mb: 4 }}>
            {articles.map((article) => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={article.id}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <CardActionArea 
                    component={RouterLink} 
                    to={`/articles/${article.slug}`}
                    sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}
                  >
                    {getImageUrl(article) && (
                      <CardMedia
                        component="img"
                        height="200"
                        image={getImageUrl(article)}
                        alt={article.teaserImageAlt || article.featuredImageAlt || article.title}
                        sx={{ objectFit: 'cover' }}
                      />
                    )}
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography variant="h6" component="h2" gutterBottom>
                        {article.title}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" display="block" mb={1}>
                        {formatDate(article.publishedAt)}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {getExcerpt(article)}
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            ))}
          </Grid>

          {totalPages > 1 && (
            <Box display="flex" justifyContent="center">
              <Pagination 
                count={totalPages} 
                page={page} 
                onChange={handlePageChange}
                color="primary"
                size="large"
              />
            </Box>
          )}
        </>
      )}
    </Box>
  );
};

export default ArticleList;
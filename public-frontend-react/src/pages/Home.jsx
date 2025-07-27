import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Box,
  Typography,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Button,
  Skeleton,
  Alert,
  Stack,
  Chip
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { Link } from 'react-router-dom';
import { api, formatDate, stripHtml, truncateText } from '../services/api';

// Styled components
const PhotoBookCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'transform 0.3s, box-shadow 0.3s',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.shadows[8],
  }
}));

const ArticleCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'transform 0.3s, box-shadow 0.3s',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: theme.shadows[4],
  }
}));

const Home = () => {
  const [photoBooks, setPhotoBooks] = useState([]);
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadContent();
  }, []);

  const loadContent = async () => {
    try {
      setLoading(true);
      const [photoBooksData, articlesData] = await Promise.all([
        api.getPhotoBooks(6),
        api.getArticles(4)
      ]);
      
      setPhotoBooks(photoBooksData.photobooks || []);
      setArticles(articlesData.articles || []);
    } catch (err) {
      console.error('Error loading content:', err);
      setError('Failed to load content. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Grid container spacing={4}>
        {/* Left Column - Photo Books (2/3) */}
        <Grid item xs={12} md={8}>
          <Box sx={{ mb: 3 }}>
            <Typography variant="h4" component="h2" gutterBottom>
              Featured Photo Books
            </Typography>
          </Box>
          
          <Grid container spacing={3}>
            {loading ? (
              [...Array(6)].map((_, index) => (
                <Grid item key={index} xs={12} sm={6}>
                  <Skeleton variant="rectangular" height={300} />
                </Grid>
              ))
            ) : (
              photoBooks.map((photoBook) => (
                <Grid item key={photoBook.id} xs={12} sm={6}>
                  <PhotoBookCard>
                    {photoBook.featuredImage && (
                      <CardMedia
                        component="img"
                        height="240"
                        image={photoBook.featuredImage.startsWith('http')
                          ? photoBook.featuredImage
                          : `${window.location.origin}${photoBook.featuredImage}`}
                        alt={photoBook.title}
                        onError={(e) => {
                          e.target.src = '/images/placeholder.jpg';
                        }}
                      />
                    )}
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography variant="h6" component="h3" gutterBottom>
                        {photoBook.title}
                      </Typography>
                      {photoBook.metadata?.pageCount && (
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                          {photoBook.metadata.pageCount} pages
                        </Typography>
                      )}
                      <Typography variant="body2" color="text.secondary">
                        {truncateText(stripHtml(photoBook.body), 120)}
                      </Typography>
                    </CardContent>
                    <CardActions>
                      <Button
                        size="small"
                        component={Link}
                        to={`/photobook/${photoBook.slug}`}
                      >
                        View Photo Book
                      </Button>
                    </CardActions>
                  </PhotoBookCard>
                </Grid>
              ))
            )}
          </Grid>
          
          {!loading && photoBooks.length > 0 && (
            <Box sx={{ mt: 3, textAlign: 'center' }}>
              <Button
                variant="outlined"
                component={Link}
                to="/photobooks"
              >
                View All Photo Books
              </Button>
            </Box>
          )}
        </Grid>

        {/* Right Column - Articles (1/3) */}
        <Grid item xs={12} md={4}>
          <Box sx={{ mb: 3 }}>
            <Typography variant="h4" component="h2" gutterBottom>
              Latest Articles
            </Typography>
          </Box>
          
          <Stack spacing={3}>
            {loading ? (
              [...Array(4)].map((_, index) => (
                <Skeleton key={index} variant="rectangular" height={120} />
              ))
            ) : (
              articles.map((article) => (
                <ArticleCard key={article.id}>
                  {article.featuredImage && (
                    <CardMedia
                      component="img"
                      height="140"
                      image={article.featuredImage.startsWith('http')
                        ? article.featuredImage
                        : `${window.location.origin}${article.featuredImage}`}
                      alt={article.title}
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  )}
                  <CardContent>
                    <Typography variant="h6" component="h3" gutterBottom>
                      {article.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" paragraph>
                      {truncateText(stripHtml(article.body), 100)}
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="caption" color="text.secondary">
                        {formatDate(article.publishedAt || article.createdAt)}
                      </Typography>
                      {article.metadata?.tags && article.metadata.tags.length > 0 && (
                        <Chip label={article.metadata.tags[0]} size="small" />
                      )}
                    </Box>
                  </CardContent>
                  <CardActions>
                    <Button
                      size="small"
                      component={Link}
                      to={`/article/${article.slug}`}
                    >
                      Read More
                    </Button>
                  </CardActions>
                </ArticleCard>
              ))
            )}
          </Stack>
          
          {!loading && articles.length > 0 && (
            <Box sx={{ mt: 3, textAlign: 'center' }}>
              <Button
                variant="outlined"
                component={Link}
                to="/articles"
                fullWidth
              >
                View All Articles
              </Button>
            </Box>
          )}
        </Grid>
      </Grid>
    </Container>
  );
};

export default Home;
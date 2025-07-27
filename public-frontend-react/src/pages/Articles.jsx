import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  CircularProgress,
  Alert,
} from '@mui/material';
import { api, stripHtml, truncateText, extractFirstImage } from '../services/api';
import ArticleCard from '../components/ArticleCard';

const Articles = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setLoading(true);
        const data = await api.getArticles(20); // Get more articles for the listing page
        
        if (data.articles && data.articles.length > 0) {
          setArticles(data.articles);
        }
      } catch (err) {
        console.error('Error loading articles:', err);
        setError('Failed to load articles. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  return (
    <Box sx={{ minHeight: '60vh', py: 5 }}>
      <Container maxWidth="lg">
        <Typography
          variant="h3"
          component="h1"
          sx={{
            mb: 5,
            fontFamily: 'Georgia, serif',
            fontWeight: 'normal',
          }}
        >
          Articles
        </Typography>

        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress />
          </Box>
        )}

        {error && (
          <Alert severity="error" sx={{ mb: 4 }}>
            {error}
          </Alert>
        )}

        {!loading && !error && articles.length === 0 && (
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ fontStyle: 'italic', textAlign: 'center', py: 8 }}
          >
            No articles published yet.
          </Typography>
        )}

        {!loading && !error && articles.length > 0 && (
          <Grid container spacing={3}>
            {articles.map((article) => (
              <Grid item xs={12} sm={6} md={4} key={article.id}>
                <ArticleCard
                  title={article.title}
                  slug={article.slug}
                  body={article.body}
                  coverImageUrl={
                    article.featuredImage ||
                    article.coverImageUrl || // Fallback for backward compatibility
                    extractFirstImage(article.body || '')
                  }
                  type="article"
                  id={article.id}
                  excerpt={truncateText(stripHtml(article.body || ''))}
                  linkText="Read the article"
                  linkPath={`/article/${article.slug}`}
                />
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </Box>
  );
};

export default Articles;
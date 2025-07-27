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

const PhotoBooks = () => {
  const [photoBooks, setPhotoBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPhotoBooks = async () => {
      try {
        setLoading(true);
        const data = await api.getPhotoBooks(20); // Get more photo books for the listing page
        
        if (data.photobooks && data.photobooks.length > 0) {
          setPhotoBooks(data.photobooks);
        } else if (data.photoBooks && data.photoBooks.length > 0) {
          // Fallback for old API response format
          setPhotoBooks(data.photoBooks);
        }
      } catch (err) {
        console.error('Error loading photo books:', err);
        setError('Failed to load photo books. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchPhotoBooks();
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
          Photo Books
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

        {!loading && !error && photoBooks.length === 0 && (
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ fontStyle: 'italic', textAlign: 'center', py: 8 }}
          >
            No photo books published yet.
          </Typography>
        )}

        {!loading && !error && photoBooks.length > 0 && (
          <Grid container spacing={3}>
            {photoBooks.map((book) => (
              <Grid item xs={12} sm={6} md={4} key={book.id}>
                <ArticleCard
                  title={book.title}
                  slug={book.slug}
                  body={book.body}
                  coverImageUrl={
                    book.featuredImage ||
                    book.coverImageUrl || // Fallback for backward compatibility
                    extractFirstImage(book.body || '')
                  }
                  type="photobook"
                  id={book.id}
                  excerpt={truncateText(stripHtml(book.body || ''))}
                  linkText="View photo book"
                  linkPath={`/photobook/${book.slug}`}
                />
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </Box>
  );
};

export default PhotoBooks;
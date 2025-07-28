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
  Link,
  Container
} from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary';
import api from '../../services/api';

const PhotoBookList = () => {
  const [photoBooks, setPhotoBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 12;

  useEffect(() => {
    fetchPhotoBooks();
  }, [page]);

  const fetchPhotoBooks = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/public/photobooks?page=${page}&limit=${itemsPerPage}`);
      setPhotoBooks(response.data.photobooks || []);
      setTotalPages(response.data.totalPages || 1);
    } catch (error) {
      console.error('Failed to fetch photo books:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (event, value) => {
    setPage(value);
    window.scrollTo(0, 0);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Recently added';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getImageUrl = (book) => {
    // Use teaser image if available, otherwise fall back to featured image
    const imageUrl = book.teaserImage || book.featuredImage;
    if (!imageUrl) return null;
    
    // If it's a relative URL, prepend the backend URL
    if (imageUrl.startsWith('/uploads')) {
      return `${imageUrl}`;
    }
    return imageUrl;
  };

  const getDescription = (book) => {
    // Use summary if available
    if (book.summary) return book.summary;
    
    // Fall back to metadata description
    if (book.metadata?.description) return book.metadata.description;
    
    // Finally, strip HTML tags and get first 100 characters
    const stripped = book.body.replace(/<[^>]*>/g, '');
    return stripped.length > 100 ? stripped.substring(0, 100) + '...' : stripped;
  };

  if (loading && page === 1) {
    return (
      <Box display="flex" justifyContent="center" py={8}>
        <CircularProgress />
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
          <Typography color="text.primary">Photo Books</Typography>
        </Breadcrumbs>

        <Typography variant="h3" component="h1" gutterBottom>
          Photo Books
        </Typography>

      {photoBooks.length === 0 ? (
        <Box py={8} textAlign="center">
          <Typography variant="h5" color="text.secondary">
            No photo books found
          </Typography>
        </Box>
      ) : (
        <>
          <Grid container spacing={3} sx={{ mb: 4 }}>
            {photoBooks.map((book) => (
              <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={book.id}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <CardActionArea 
                    component={RouterLink} 
                    to={`/photobooks/${book.slug}`}
                    sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}
                  >
                    <Box sx={{ position: 'relative', paddingTop: '100%', overflow: 'hidden' }}>
                      {getImageUrl(book) ? (
                        <CardMedia
                          component="img"
                          image={getImageUrl(book)}
                          alt={book.teaserImageAlt || book.featuredImageAlt || book.title}
                          sx={{ 
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover' 
                          }}
                        />
                      ) : (
                        <Box
                          sx={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: 'grey.200'
                          }}
                        >
                          <PhotoLibraryIcon sx={{ fontSize: 60, color: 'grey.500' }} />
                        </Box>
                      )}
                    </Box>
                    <CardContent>
                      <Typography variant="h6" component="h2" gutterBottom>
                        {book.title}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" display="block" mb={1}>
                        {formatDate(book.publishedAt)}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {getDescription(book)}
                      </Typography>
                      {book.metadata?.pageCount > 1 && (
                        <Typography variant="caption" color="primary" display="block" mt={1}>
                          {book.metadata.pageCount} pages
                        </Typography>
                      )}
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
    </Container>
  );
};

export default PhotoBookList;
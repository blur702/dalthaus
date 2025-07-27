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
import { api, formatDate, isAdminLoggedIn, getEditLink } from '../services/api';
import { usePagination } from '../hooks/usePagination';
import Pagination from '../components/Pagination';

const Article = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const isAdmin = isAdminLoggedIn();
  const editUrl = article ? getEditLink('article', article.id) : null;

  const {
    currentPage,
    totalPages,
    currentContent,
    hasPagination,
    goToPage,
    nextPage,
    prevPage,
    canGoNext,
    canGoPrev,
  } = usePagination(article?.body);

  useEffect(() => {
    if (!id) {
      navigate('/');
      return;
    }

    const fetchArticle = async () => {
      try {
        setLoading(true);
        const data = await api.getArticle(id);
        setArticle(data);
      } catch (err) {
        console.error('Error loading article:', err);
        setError('Article not found or unavailable.');
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [id, navigate]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (hasPagination) {
        if (e.key === 'ArrowLeft' && canGoPrev) {
          prevPage();
        } else if (e.key === 'ArrowRight' && canGoNext) {
          nextPage();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [hasPagination, canGoPrev, canGoNext, prevPage, nextPage]);

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

  if (!article) return null;

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
            mb: 3,
          }}
        >
          {article.title}
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            mb: 4,
            fontStyle: 'italic',
          }}
        >
          Published on {formatDate(article.publishedAt)}
        </Typography>

        {(article.featuredImage || article.coverImageUrl) && (
          <Box sx={{ mb: 4, mx: -2 }}>
            <Box
              component="img"
              src={article.featuredImage || article.coverImageUrl}
              alt={article.title}
              sx={{
                width: '100%',
                height: 'auto',
                maxHeight: 600,
                objectFit: 'cover',
                borderRadius: 1,
              }}
              onError={(e) => {
                e.target.style.opacity = '0.5';
              }}
            />
          </Box>
        )}

        <Box
          className="article-content"
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
            '& .page-break': {
              display: 'none',
            },
          }}
          dangerouslySetInnerHTML={{ __html: currentContent }}
        />

        {hasPagination && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={goToPage}
            onPrevious={prevPage}
            onNext={nextPage}
            canGoPrev={canGoPrev}
            canGoNext={canGoNext}
          />
        )}
      </Paper>
    </Container>
  );
};

export default Article;
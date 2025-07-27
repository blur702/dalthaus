import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Paper,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  Alert,
  Link as MuiLink,
} from '@mui/material';
import { Link } from 'react-router-dom';
import { api, formatDate } from '../services/api';

const Contents = () => {
  const [pages, setPages] = useState([]);
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch both pages and articles
        const [pagesData, articlesData] = await Promise.all([
          api.getPages(),
          api.getArticles(10),
        ]);

        setPages(pagesData);
        if (articlesData.articles) {
          setArticles(articlesData.articles);
        }
      } catch (err) {
        console.error('Error loading content:', err);
        setError('Failed to load content. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Recursive function to render page tree
  const renderPageTree = (pages) => {
    return (
      <List component="div" disablePadding>
        {pages.map((page) => (
          <React.Fragment key={page.id}>
            <ListItem
              sx={{
                pl: page.level ? page.level * 2 : 0,
                '&:hover': {
                  backgroundColor: 'action.hover',
                },
              }}
            >
              <ListItemText
                primary={
                  <MuiLink
                    component={Link}
                    to={`/page/${page.slug}`}
                    sx={{
                      color: 'inherit',
                      textDecoration: 'none',
                      '&:hover': {
                        color: 'primary.main',
                        textDecoration: 'underline',
                      },
                    }}
                  >
                    {page.title}
                  </MuiLink>
                }
              />
            </ListItem>
            {page.children && page.children.length > 0 && renderPageTree(page.children)}
          </React.Fragment>
        ))}
      </List>
    );
  };

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

  return (
    <Container maxWidth="lg" sx={{ py: 5 }}>
      <Typography
        variant="h3"
        component="h1"
        sx={{
          mb: 5,
          fontFamily: 'Georgia, serif',
          fontWeight: 'normal',
        }}
      >
        Contents
      </Typography>

      <Grid container spacing={4}>
        {/* Pages Navigation */}
        <Grid item xs={12} md={4}>
          <Paper
            elevation={1}
            sx={{
              p: 3,
              height: '100%',
            }}
          >
            <Typography
              variant="h5"
              gutterBottom
              sx={{
                fontFamily: 'Georgia, serif',
                mb: 3,
              }}
            >
              Pages
            </Typography>
            
            {pages.length === 0 ? (
              <Typography variant="body2" color="text.secondary">
                No pages available.
              </Typography>
            ) : (
              renderPageTree(pages)
            )}
          </Paper>
        </Grid>

        {/* Recent Articles */}
        <Grid item xs={12} md={8}>
          <Paper
            elevation={1}
            sx={{
              p: 3,
              height: '100%',
            }}
          >
            <Typography
              variant="h5"
              gutterBottom
              sx={{
                fontFamily: 'Georgia, serif',
                mb: 3,
              }}
            >
              Recent Articles
            </Typography>

            {articles.length === 0 ? (
              <Typography variant="body2" color="text.secondary">
                No articles published yet.
              </Typography>
            ) : (
              <List>
                {articles.map((article) => (
                  <ListItem
                    key={article.id}
                    sx={{
                      borderBottom: '1px solid',
                      borderColor: 'divider',
                      '&:last-child': {
                        borderBottom: 'none',
                      },
                      '&:hover': {
                        backgroundColor: 'action.hover',
                      },
                    }}
                  >
                    <ListItemText
                      primary={
                        <MuiLink
                          component={Link}
                          to={`/article/${article.slug}`}
                          sx={{
                            color: 'inherit',
                            textDecoration: 'none',
                            fontSize: '1.1rem',
                            fontWeight: 500,
                            '&:hover': {
                              color: 'primary.main',
                              textDecoration: 'underline',
                            },
                          }}
                        >
                          {article.title}
                        </MuiLink>
                      }
                      secondary={
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          component="span"
                        >
                          {formatDate(article.publishedAt)}
                        </Typography>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Contents;
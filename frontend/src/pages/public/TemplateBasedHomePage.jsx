import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Box, CircularProgress } from '@mui/material';
import FrontPageTemplate from '../../templates/FrontPageTemplate';
import '../../templates/main.css';
import api from '../../services/api';

const TemplateBasedHomePage = () => {
  // No longer using outlet context - template is hard-coded
  const [loading, setLoading] = useState(true);
  const [articles, setArticles] = useState([]);
  const [photoBooks, setPhotoBooks] = useState([]);

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      // Fetch articles and photo books
      const [articlesRes, photoBooksRes] = await Promise.all([
        api.get('/public/articles?limit=10'),
        api.get('/public/photobooks?limit=10')
      ]);
      
      setArticles(articlesRes.data.articles || []);
      setPhotoBooks(photoBooksRes.data.photobooks || []);
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
    <FrontPageTemplate
      articles={articles}
      photoBooks={photoBooks}
      isPreview={false}
    />
  );
};

export default TemplateBasedHomePage;
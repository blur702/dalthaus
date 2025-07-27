import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import theme from './theme/theme';
import Layout from './layouts/Layout';
import { checkAdminAuth } from './services/api';

// Pages
import Home from './pages/Home';
import Articles from './pages/Articles';
import Article from './pages/Article';
import PhotoBooks from './pages/PhotoBooks';
import PhotoBook from './pages/PhotoBook';
import Page from './pages/Page';
import About from './pages/About';

function App() {
  useEffect(() => {
    // Check for admin authentication on app load
    checkAdminAuth();
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="articles" element={<Articles />} />
            <Route path="article/:id" element={<Article />} />
            <Route path="photobooks" element={<PhotoBooks />} />
            <Route path="photobook/:id" element={<PhotoBook />} />
            <Route path="page/:id" element={<Page />} />
            <Route path="about" element={<About />} />
          </Route>
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
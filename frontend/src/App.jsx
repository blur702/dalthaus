import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import AdminDashboard from './pages/AdminDashboard';
import CreateUserPage from './pages/CreateUserPage';
import UserManagement from './modules/users/pages/UserManagement';
import ArticleManagement from './modules/content/pages/ArticleManagement';
import PageManagement from './modules/content/pages/PageManagement';
import PhotoBookManagement from './modules/content/pages/PhotoBookManagement';
import TinymceSettings from './modules/settings/TinymceSettings';
import Settings from './modules/settings/Settings';
import ContentPreview from './pages/ContentPreview';
import TestPagebreak from './pages/TestPagebreak';
import PagebreakTest from './pages/PagebreakTest';
import SimplePagebreakTest from './pages/SimplePagebreakTest';
import TestTinymceIntegration from './pages/TestTinymceIntegration';
import MaterialUITest from './pages/MaterialUITest';
import TestFrontPage from './pages/TestFrontPage';
// Template imports removed - using hard-coded templates
import ProtectedRoute from './components/ProtectedRoute';
import ErrorBoundary from './components/ErrorBoundary';
import ScrollToTop from './components/ScrollToTop';
import api from './services/api';
import { SiteSettingsProvider } from './contexts/SiteSettingsContext';
import './styles/global.css'; // Import global styles

// Public components
import PublicLayout from './layouts/PublicLayout';
import TemplateBasedHomePage from './pages/public/TemplateBasedHomePage';
import ArticleView from './pages/public/ArticleView';
import ArticleList from './pages/public/ArticleList';
import PhotoBookList from './pages/public/PhotoBookList';
import PhotoBookView from './pages/public/PhotoBookView';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user has a valid token on app initialization
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      
      if (token) {
        try {
          // Verify token with backend
          const response = await api.get('/auth/verify');
          if (response.status === 200) {
            setIsAuthenticated(true);
          }
        } catch (error) {
          // Token is invalid or expired
          localStorage.removeItem('token');
          setIsAuthenticated(false);
        }
      }
      
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <SiteSettingsProvider>
        <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <ScrollToTop />
          <Routes>
          <Route 
          path="/login" 
          element={<LoginPage setIsAuthenticated={setIsAuthenticated} />} 
        />
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <AdminDashboard setIsAuthenticated={setIsAuthenticated} />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/users/create" 
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <CreateUserPage setIsAuthenticated={setIsAuthenticated} />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/users" 
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <UserManagement setIsAuthenticated={setIsAuthenticated} />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/content/articles" 
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <ArticleManagement setIsAuthenticated={setIsAuthenticated} />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/content/pages" 
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <PageManagement setIsAuthenticated={setIsAuthenticated} />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/content/photo-books" 
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <PhotoBookManagement setIsAuthenticated={setIsAuthenticated} />
            </ProtectedRoute>
          } 
        />
        <Route
          path="/admin/settings"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <Settings setIsAuthenticated={setIsAuthenticated} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/settings/tinymce"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <TinymceSettings setIsAuthenticated={setIsAuthenticated} />
            </ProtectedRoute>
          }
        />
        {/* Template routes removed - using hard-coded templates */}
        
        {/* Test route for front page template */}
        <Route
          path="/test-front-page"
          element={<TestFrontPage />}
        />
        <Route
          path="/preview/:type/:id"
          element={<ContentPreview />}
        />
        <Route
          path="/test-pagebreak"
          element={<TestPagebreak />}
        />
        <Route
          path="/pagebreak-test"
          element={<PagebreakTest />}
        />
        <Route
          path="/simple-pagebreak-test"
          element={<SimplePagebreakTest />}
        />
        <Route
          path="/admin/test/tinymce"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <TestTinymceIntegration setIsAuthenticated={setIsAuthenticated} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/test/material-ui"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <MaterialUITest setIsAuthenticated={setIsAuthenticated} />
            </ProtectedRoute>
          }
        />
        {/* Public Routes */}
        <Route path="/" element={<PublicLayout />}>
          <Route index element={<TemplateBasedHomePage />} />
          <Route path="articles" element={<ArticleList />} />
          <Route path="articles/:slug" element={<ArticleView />} />
          <Route path="photobooks" element={<PhotoBookList />} />
          <Route path="photobooks/:slug" element={<PhotoBookView />} />
        </Route>
        
        {/* Admin login redirect */}
        <Route path="/admin/login" element={<Navigate to="/login" replace />} />
        
        {/* Default redirect - only if no other route matches */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
    </SiteSettingsProvider>
    </ErrorBoundary>
  );
}

export default App;
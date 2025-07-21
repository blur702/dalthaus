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
import ContentPreview from './pages/ContentPreview';
import TestPagebreak from './pages/TestPagebreak';
import PagebreakTest from './pages/PagebreakTest';
import SimplePagebreakTest from './pages/SimplePagebreakTest';
import ProtectedRoute from './components/ProtectedRoute';
import ErrorBoundary from './components/ErrorBoundary';
import api from './services/api';

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
      <Router>
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
          path="/admin/settings/tinymce" 
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <TinymceSettings setIsAuthenticated={setIsAuthenticated} />
            </ProtectedRoute>
          } 
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
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
    </ErrorBoundary>
  );
}

export default App;
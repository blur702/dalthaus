import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import AdminDashboard from './pages/AdminDashboard';
import CreateUserPage from './pages/CreateUserPage';
import UserManagement from './modules/users/pages/UserManagement';
import ArticleManagement from './modules/content/pages/ArticleManagement';
import PageManagement from './modules/content/pages/PageManagement';
import PhotoBookManagement from './modules/content/pages/PhotoBookManagement';
import ContentPreview from './pages/ContentPreview';
import TestPagebreak from './pages/TestPagebreak';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
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
          path="/preview/:type/:id" 
          element={<ContentPreview />} 
        />
        <Route 
          path="/test-pagebreak" 
          element={<TestPagebreak />} 
        />
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
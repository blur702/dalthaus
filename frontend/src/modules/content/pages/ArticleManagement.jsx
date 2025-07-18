import React, { useState, useEffect } from 'react';
import AdminLayout from '../../../components/AdminLayout';
import ContentEditor from '../components/ContentEditor';
import { articleService } from '../services/contentService';

const ArticleManagement = ({ setIsAuthenticated }) => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [showEditor, setShowEditor] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState(null);

  useEffect(() => {
    loadArticles();
  }, []);

  const loadArticles = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await articleService.getAll();
      setArticles(data.items || []);
    } catch (err) {
      setError(err.message || 'Failed to load articles');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setSelectedArticle(null);
    setShowEditor(true);
  };

  const handleEdit = (article) => {
    setSelectedArticle(article);
    setShowEditor(true);
  };

  const handleSave = async (articleData) => {
    try {
      if (selectedArticle) {
        await articleService.update(selectedArticle.id, articleData);
        setSuccessMessage('Article updated successfully');
      } else {
        await articleService.create(articleData);
        setSuccessMessage('Article created successfully');
      }
      
      setShowEditor(false);
      loadArticles();
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setError(err.message || 'Failed to save article');
    }
  };

  const handleDelete = async (article) => {
    if (window.confirm(`Are you sure you want to delete "${article.title}"?`)) {
      try {
        await articleService.delete(article.id);
        setSuccessMessage('Article deleted successfully');
        loadArticles();
        setTimeout(() => setSuccessMessage(''), 3000);
      } catch (err) {
        setError(err.message || 'Failed to delete article');
      }
    }
  };

  if (showEditor) {
    return (
      <AdminLayout setIsAuthenticated={setIsAuthenticated}>
        <div className="content-management">
          <ContentEditor
            content={selectedArticle}
            contentType="article"
            onSave={handleSave}
            onCancel={() => setShowEditor(false)}
          />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout setIsAuthenticated={setIsAuthenticated}>
      <div className="content-management">
        <div className="page-header">
          <h2>Article Management</h2>
          <button className="btn-primary" onClick={handleCreate}>
            Create New Article
          </button>
        </div>

        {error && (
          <div className="alert alert-error">
            {error}
            <button className="alert-close" onClick={() => setError('')}>
              &times;
            </button>
          </div>
        )}

        {successMessage && (
          <div className="alert alert-success">
            {successMessage}
          </div>
        )}

        {loading ? (
          <div className="loading">Loading articles...</div>
        ) : articles.length === 0 ? (
          <div className="no-content">
            <p>No articles found.</p>
            <button className="btn-primary" onClick={handleCreate}>
              Create Your First Article
            </button>
          </div>
        ) : (
          <div className="content-list">
            <table className="content-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Status</th>
                  <th>Author</th>
                  <th>Created</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {articles.map(article => (
                  <tr key={article.id}>
                    <td>{article.title}</td>
                    <td>
                      <span className={`status-badge status-${article.status}`}>
                        {article.status}
                      </span>
                    </td>
                    <td>{article.author?.username || 'Unknown'}</td>
                    <td>{new Date(article.createdAt).toLocaleDateString()}</td>
                    <td>
                      <div className="action-buttons">
                        <button
                          className="btn-preview"
                          onClick={() => window.open(`/preview/article/${article.id}`, '_blank')}
                        >
                          Preview
                        </button>
                        <button
                          className="btn-edit"
                          onClick={() => handleEdit(article)}
                        >
                          Edit
                        </button>
                        <button
                          className="btn-delete"
                          onClick={() => handleDelete(article)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default ArticleManagement;
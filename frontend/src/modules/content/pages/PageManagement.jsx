import React, { useState, useEffect } from 'react';
import AdminLayout from '../../../components/AdminLayout';
import ContentEditor from '../components/ContentEditor';
import { pageService } from '../services/contentService';

const PageManagement = ({ setIsAuthenticated }) => {
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [showEditor, setShowEditor] = useState(false);
  const [selectedPage, setSelectedPage] = useState(null);

  useEffect(() => {
    loadPages();
  }, []);

  const loadPages = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await pageService.getAll();
      setPages(data.items || []);
    } catch (err) {
      setError(err.message || 'Failed to load pages');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setSelectedPage(null);
    setShowEditor(true);
  };

  const handleEdit = (page) => {
    setSelectedPage(page);
    setShowEditor(true);
  };

  const handleSave = async (pageData) => {
    try {
      if (selectedPage) {
        await pageService.update(selectedPage.id, pageData);
        setSuccessMessage('Page updated successfully');
      } else {
        await pageService.create(pageData);
        setSuccessMessage('Page created successfully');
      }
      
      setShowEditor(false);
      loadPages();
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setError(err.message || 'Failed to save page');
    }
  };

  const handleDelete = async (page) => {
    if (window.confirm(`Are you sure you want to delete "${page.title}"?`)) {
      try {
        await pageService.delete(page.id);
        setSuccessMessage('Page deleted successfully');
        loadPages();
        setTimeout(() => setSuccessMessage(''), 3000);
      } catch (err) {
        setError(err.message || 'Failed to delete page');
      }
    }
  };

  const getStatusBadge = (status) => {
    const statusClasses = {
      draft: 'badge-draft',
      published: 'badge-published',
      archived: 'badge-archived'
    };
    return `badge ${statusClasses[status] || ''}`;
  };

  if (showEditor) {
    return (
      <AdminLayout setIsAuthenticated={setIsAuthenticated}>
        <div className="content-management">
          <ContentEditor
            content={selectedPage}
            contentType="page"
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
          <h2>Page Management</h2>
          <button className="btn-primary" onClick={handleCreate}>
            Create New Page
          </button>
        </div>

        {error && (
          <div className="alert alert-error">
            {error}
            <button className="alert-close" onClick={() => setError('')}>
              ×
            </button>
          </div>
        )}

        {successMessage && (
          <div className="alert alert-success">
            {successMessage}
          </div>
        )}

        {loading ? (
          <div className="loading">Loading pages...</div>
        ) : (
          <div className="content-table">
            <table>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Slug</th>
                  <th>Template</th>
                  <th>Show in Menu</th>
                  <th>Status</th>
                  <th>Author</th>
                  <th>Updated</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {pages.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="empty">No pages found</td>
                  </tr>
                ) : (
                  pages.map(page => (
                    <tr key={page.id}>
                      <td>{page.title}</td>
                      <td className="slug">{page.slug}</td>
                      <td>{page.template || 'default'}</td>
                      <td>{page.showInMenu ? '✓' : '—'}</td>
                      <td>
                        <span className={getStatusBadge(page.status)}>
                          {page.status}
                        </span>
                      </td>
                      <td>{page.author?.username || 'Unknown'}</td>
                      <td>{new Date(page.updatedAt).toLocaleDateString()}</td>
                      <td className="actions">
                        <button 
                          className="btn-icon" 
                          onClick={() => handleEdit(page)}
                          title="Edit"
                        >
                          ✏️
                        </button>
                        <button 
                          className="btn-icon" 
                          onClick={() => handleDelete(page)}
                          title="Delete"
                        >
                          🗑️
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default PageManagement;
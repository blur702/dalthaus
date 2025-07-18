import React, { useState, useEffect } from 'react';
import AdminLayout from '../../../components/AdminLayout';
import ContentEditor from '../components/ContentEditor';
import { photoBookService } from '../services/contentService';

const PhotoBookManagement = ({ setIsAuthenticated }) => {
  const [photoBooks, setPhotoBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [showEditor, setShowEditor] = useState(false);
  const [selectedPhotoBook, setSelectedPhotoBook] = useState(null);

  useEffect(() => {
    loadPhotoBooks();
  }, []);

  const loadPhotoBooks = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await photoBookService.getAll();
      setPhotoBooks(data.items || []);
    } catch (err) {
      setError(err.message || 'Failed to load photo books');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setSelectedPhotoBook(null);
    setShowEditor(true);
  };

  const handleEdit = (photoBook) => {
    setSelectedPhotoBook(photoBook);
    setShowEditor(true);
  };

  const handleSave = async (photoBookData) => {
    try {
      if (selectedPhotoBook) {
        await photoBookService.update(selectedPhotoBook.id, photoBookData);
        setSuccessMessage('Photo book updated successfully');
      } else {
        await photoBookService.create(photoBookData);
        setSuccessMessage('Photo book created successfully');
      }
      
      setShowEditor(false);
      loadPhotoBooks();
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setError(err.message || 'Failed to save photo book');
    }
  };

  const handleDelete = async (photoBook) => {
    if (window.confirm(`Are you sure you want to delete "${photoBook.title}"?`)) {
      try {
        await photoBookService.delete(photoBook.id);
        setSuccessMessage('Photo book deleted successfully');
        loadPhotoBooks();
        setTimeout(() => setSuccessMessage(''), 3000);
      } catch (err) {
        setError(err.message || 'Failed to delete photo book');
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
            content={selectedPhotoBook}
            contentType="photoBook"
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
          <h2>Photo Book Management</h2>
          <button className="btn-primary" onClick={handleCreate}>
            Create New Photo Book
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
          <div className="loading">Loading photo books...</div>
        ) : (
          <div className="content-table">
            <table>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Slug</th>
                  <th>Cover Image</th>
                  <th>Photo Count</th>
                  <th>Status</th>
                  <th>Author</th>
                  <th>Updated</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {photoBooks.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="empty">No photo books found</td>
                  </tr>
                ) : (
                  photoBooks.map(photoBook => (
                    <tr key={photoBook.id}>
                      <td>{photoBook.title}</td>
                      <td className="slug">{photoBook.slug}</td>
                      <td>
                        {photoBook.coverImage ? (
                          <img 
                            src={photoBook.coverImage} 
                            alt="Cover" 
                            style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                          />
                        ) : (
                          '—'
                        )}
                      </td>
                      <td>{photoBook.photoCount || 0}</td>
                      <td>
                        <span className={getStatusBadge(photoBook.status)}>
                          {photoBook.status}
                        </span>
                      </td>
                      <td>{photoBook.author?.username || 'Unknown'}</td>
                      <td>{new Date(photoBook.updatedAt).toLocaleDateString()}</td>
                      <td className="actions">
                        <button 
                          className="btn-icon" 
                          onClick={() => window.open(`/preview/photo-book/${photoBook.id}`, '_blank')}
                          title="Preview"
                        >
                          👁️
                        </button>
                        <button 
                          className="btn-icon" 
                          onClick={() => handleEdit(photoBook)}
                          title="Edit"
                        >
                          ✏️
                        </button>
                        <button 
                          className="btn-icon" 
                          onClick={() => handleDelete(photoBook)}
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

export default PhotoBookManagement;
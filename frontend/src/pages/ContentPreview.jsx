import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ContentViewer from '../components/ContentViewer';
import { articleService, pageService, photoBookService } from '../modules/content/services/contentService';

const ContentPreview = () => {
  const { type, id } = useParams();
  const navigate = useNavigate();
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadContent();
  }, [type, id]);

  const loadContent = async () => {
    try {
      setLoading(true);
      setError('');
      
      let service;
      switch (type) {
        case 'article':
          service = articleService;
          break;
        case 'page':
          service = pageService;
          break;
        case 'photo-book':
          service = photoBookService;
          break;
        default:
          throw new Error('Invalid content type');
      }

      const data = await service.getById(id);
      setContent(data);
    } catch (err) {
      setError(err.message || 'Failed to load content');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="content-preview-container">
        <div className="loading">Loading content...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="content-preview-container">
        <div className="alert alert-error">
          {error}
          <button onClick={() => navigate(-1)} className="btn-secondary">
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!content) {
    return (
      <div className="content-preview-container">
        <div className="alert alert-error">Content not found</div>
      </div>
    );
  }

  return (
    <div className="content-preview-container">
      <div className="content-preview-header">
        <button onClick={() => navigate(-1)} className="btn-back">
          ← Back
        </button>
        <div className="preview-info">
          <span className="preview-type">{type.replace('-', ' ')}</span>
          <span className="preview-status">{content.status}</span>
          {content.metadata?.pageCount > 1 && (
            <span className="preview-pages">
              {content.metadata.pageCount} pages
            </span>
          )}
        </div>
      </div>

      <article className="content-article">
        <header className="content-header">
          <h1>{content.title}</h1>
          {content.author && (
            <div className="content-meta">
              <span>By {content.author.username}</span>
              {content.publishedAt && (
                <span> • {new Date(content.publishedAt).toLocaleDateString()}</span>
              )}
            </div>
          )}
        </header>

        {type === 'photo-book' && content.coverImage && (
          <div className="content-cover-image">
            <img src={content.coverImage} alt={content.title} />
          </div>
        )}

        {type === 'article' && content.excerpt && (
          <div className="content-excerpt">
            {content.excerpt}
          </div>
        )}

        <ContentViewer 
          content={content.body} 
          showPagination={true}
        />

        {type === 'photo-book' && content.photoCount > 0 && (
          <div className="photo-book-info">
            <p>This photo book contains {content.photoCount} photos.</p>
          </div>
        )}
      </article>
    </div>
  );
};

export default ContentPreview;
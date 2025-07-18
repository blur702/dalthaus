import React, { useState, useEffect } from 'react';
import RichTextEditor from '../../../components/RichTextEditor';

const ContentEditor = ({ content, contentType, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    body: '',
    status: 'draft',
    // Article specific
    excerpt: '',
    category: '',
    tags: [],
    featuredImage: '',
    // Page specific
    template: 'default',
    parentId: null,
    order: 0,
    showInMenu: true,
    // PhotoBook specific
    coverImage: '',
    photoCount: 0
  });

  const [errors, setErrors] = useState({});
  const [tagInput, setTagInput] = useState('');

  useEffect(() => {
    if (content) {
      setFormData({
        ...formData,
        ...content,
        tags: content.tags || []
      });
    }
  }, [content]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSlugGeneration = () => {
    if (!formData.slug && formData.title) {
      const slug = formData.title
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
      setFormData(prev => ({ ...prev, slug }));
    }
  };

  const handleTagAdd = (e) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      if (!formData.tags.includes(tagInput.trim())) {
        setFormData(prev => ({
          ...prev,
          tags: [...prev.tags, tagInput.trim()]
        }));
      }
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (!formData.body.trim()) {
      newErrors.body = 'Content body is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Filter out fields not relevant to the content type
      const dataToSave = { ...formData };
      
      if (contentType === 'article') {
        delete dataToSave.template;
        delete dataToSave.parentId;
        delete dataToSave.order;
        delete dataToSave.showInMenu;
        delete dataToSave.coverImage;
        delete dataToSave.photoCount;
      } else if (contentType === 'page') {
        delete dataToSave.excerpt;
        delete dataToSave.category;
        delete dataToSave.tags;
        delete dataToSave.featuredImage;
        delete dataToSave.coverImage;
        delete dataToSave.photoCount;
      } else if (contentType === 'photoBook') {
        delete dataToSave.excerpt;
        delete dataToSave.category;
        delete dataToSave.tags;
        delete dataToSave.featuredImage;
        delete dataToSave.template;
        delete dataToSave.parentId;
        delete dataToSave.order;
        delete dataToSave.showInMenu;
      }
      
      onSave(dataToSave);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="content-editor">
      <div className="editor-header">
        <h3>{content ? 'Edit' : 'Create'} {contentType}</h3>
      </div>

      <div className="form-row">
        <div className="form-group flex-2">
          <label htmlFor="title">Title *</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            onBlur={handleSlugGeneration}
            className={errors.title ? 'error' : ''}
          />
          {errors.title && <span className="error-message">{errors.title}</span>}
        </div>

        <div className="form-group flex-1">
          <label htmlFor="slug">Slug</label>
          <input
            type="text"
            id="slug"
            name="slug"
            value={formData.slug}
            onChange={handleChange}
            placeholder="auto-generated"
          />
        </div>
      </div>

      {contentType === 'article' && (
        <>
          <div className="form-row">
            <div className="form-group flex-1">
              <label htmlFor="category">Category</label>
              <input
                type="text"
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
              />
            </div>

            <div className="form-group flex-1">
              <label htmlFor="featuredImage">Featured Image URL</label>
              <input
                type="text"
                id="featuredImage"
                name="featuredImage"
                value={formData.featuredImage}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="excerpt">Excerpt</label>
            <textarea
              id="excerpt"
              name="excerpt"
              value={formData.excerpt}
              onChange={handleChange}
              rows="3"
            />
          </div>

          <div className="form-group">
            <label>Tags</label>
            <div className="tags-input">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleTagAdd}
                placeholder="Press Enter to add tag"
              />
              <div className="tags-list">
                {formData.tags.map(tag => (
                  <span key={tag} className="tag">
                    {tag}
                    <button type="button" onClick={() => removeTag(tag)}>×</button>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </>
      )}

      {contentType === 'page' && (
        <div className="form-row">
          <div className="form-group flex-1">
            <label htmlFor="template">Template</label>
            <select
              id="template"
              name="template"
              value={formData.template}
              onChange={handleChange}
            >
              <option value="default">Default</option>
              <option value="full-width">Full Width</option>
              <option value="sidebar">With Sidebar</option>
            </select>
          </div>

          <div className="form-group flex-1">
            <label htmlFor="order">Order</label>
            <input
              type="number"
              id="order"
              name="order"
              value={formData.order}
              onChange={handleChange}
            />
          </div>

          <div className="form-group flex-1">
            <label>
              <input
                type="checkbox"
                name="showInMenu"
                checked={formData.showInMenu}
                onChange={handleChange}
              />
              Show in Menu
            </label>
          </div>
        </div>
      )}

      {contentType === 'photoBook' && (
        <div className="form-row">
          <div className="form-group flex-1">
            <label htmlFor="coverImage">Cover Image URL</label>
            <input
              type="text"
              id="coverImage"
              name="coverImage"
              value={formData.coverImage}
              onChange={handleChange}
            />
          </div>

          <div className="form-group flex-1">
            <label htmlFor="photoCount">Photo Count</label>
            <input
              type="number"
              id="photoCount"
              name="photoCount"
              value={formData.photoCount}
              onChange={handleChange}
              min="0"
            />
          </div>
        </div>
      )}

      <div className="form-group">
        <label htmlFor="body">Content *</label>
        <RichTextEditor
          value={formData.body}
          onChange={(content) => setFormData(prev => ({ ...prev, body: content }))}
          height={400}
        />
        {errors.body && <span className="error-message">{errors.body}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="status">Status</label>
        <select
          id="status"
          name="status"
          value={formData.status}
          onChange={handleChange}
        >
          <option value="draft">Draft</option>
          <option value="published">Published</option>
          <option value="archived">Archived</option>
        </select>
      </div>

      <div className="form-actions">
        <button type="button" className="btn-cancel" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className="btn-save">
          {content ? 'Update' : 'Create'} {contentType}
        </button>
      </div>
    </form>
  );
};

export default ContentEditor;
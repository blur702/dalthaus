import React, { useState, useEffect } from 'react';
import TinymceToolbarConfig from './TinymceToolbarConfig';
import TinymceTagManager from './TinymceTagManager';
import TinymceFeatureManager from './TinymceFeatureManager';
import { AVAILABLE_PLUGINS } from './tinymceService';

const TinymceProfileEditor = ({ profile, onSave, onCancel }) => {
  const [activeTab, setActiveTab] = useState('basic');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    profileType: 'custom',
    priority: 10,
    tags: [],
    settings: {
      height: 400,
      menubar: true,
      plugins: ['pagebreak', 'lists', 'link', 'image'],
      toolbar: 'undo redo | formatselect | bold italic | alignleft aligncenter alignright | bullist numlist | link image | pagebreak',
      statusbar: true,
      branding: false
    },
    allowedUsers: [],
    allowedRoles: [],
    isDefault: false
  });
  const [allowedTags, setAllowedTags] = useState([]);
  const [features, setFeatures] = useState([]);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || '',
        description: profile.description || '',
        profileType: profile.profileType || 'custom',
        priority: profile.priority || 10,
        tags: profile.tags || [],
        settings: profile.settings || {
          height: 400,
          menubar: true,
          plugins: ['pagebreak', 'lists', 'link', 'image'],
          toolbar: 'undo redo | formatselect | bold italic | alignleft aligncenter alignright | bullist numlist | link image | pagebreak',
          statusbar: true,
          branding: false
        },
        allowedUsers: profile.allowedUsers || [],
        allowedRoles: profile.allowedRoles || [],
        isDefault: profile.isDefault || false
      });
      setAllowedTags(profile.allowedTags || []);
      setFeatures(profile.features || []);
    }
  }, [profile]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSettingsChange = (key, value) => {
    setFormData(prev => ({
      ...prev,
      settings: {
        ...prev.settings,
        [key]: value
      }
    }));
  };

  const handlePluginsChange = (plugin, isChecked) => {
    setFormData(prev => {
      const currentPlugins = prev.settings.plugins || [];
      let newPlugins;
      
      if (isChecked) {
        newPlugins = [...currentPlugins, plugin];
      } else {
        // Don't allow removal of pagebreak plugin
        if (plugin === 'pagebreak') {
          return prev;
        }
        newPlugins = currentPlugins.filter(p => p !== plugin);
      }
      
      // Ensure pagebreak is always included
      if (!newPlugins.includes('pagebreak')) {
        newPlugins.push('pagebreak');
      }
      
      return {
        ...prev,
        settings: {
          ...prev.settings,
          plugins: newPlugins
        }
      };
    });
  };

  const handleTagsChange = (e) => {
    const tags = e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag);
    setFormData(prev => ({
      ...prev,
      tags
    }));
  };

  const handleToolbarChange = (toolbar) => {
    handleSettingsChange('toolbar', toolbar);
  };

  const handleAllowedTagsChange = (tags) => {
    setAllowedTags(tags);
  };

  const handleFeaturesChange = (updatedFeatures) => {
    setFeatures(updatedFeatures);
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Profile name is required';
    }
    
    if (!formData.profileType) {
      newErrors.profileType = 'Profile type is required';
    }
    
    if (formData.priority < 0 || formData.priority > 100) {
      newErrors.priority = 'Priority must be between 0 and 100';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    // Ensure pagebreak plugin is always included
    if (!formData.settings.plugins.includes('pagebreak')) {
      formData.settings.plugins.push('pagebreak');
    }
    
    const profileData = {
      ...formData,
      allowedTags,
      features
    };
    
    onSave(profileData);
  };

  const tabs = [
    { id: 'basic', label: 'Basic Settings' },
    { id: 'toolbar', label: 'Toolbar Configuration' },
    { id: 'tags', label: 'Allowed HTML Tags' },
    { id: 'features', label: 'Features' }
  ];

  return (
    <div className="profile-editor">
      <div className="editor-header">
        <h2>{profile ? 'Edit Profile' : 'Create New Profile'}</h2>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="tabs">
          {tabs.map(tab => (
            <button
              key={tab.id}
              type="button"
              className={`tab ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="tab-content">
          {activeTab === 'basic' && (
            <div className="basic-settings">
              <div className="form-group">
                <label htmlFor="name">Profile Name *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={errors.name ? 'error' : ''}
                />
                {errors.name && <span className="error-message">{errors.name}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={3}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="profileType">Profile Type *</label>
                  <select
                    id="profileType"
                    name="profileType"
                    value={formData.profileType}
                    onChange={handleInputChange}
                    disabled={profile && profile.isPreset}
                  >
                    <option value="custom">Custom</option>
                    <option value="user">User</option>
                    <option value="content_type">Content Type</option>
                    <option value="system">System</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="priority">Priority (0-100)</label>
                  <input
                    type="number"
                    id="priority"
                    name="priority"
                    value={formData.priority}
                    onChange={handleInputChange}
                    min="0"
                    max="100"
                    className={errors.priority ? 'error' : ''}
                  />
                  {errors.priority && <span className="error-message">{errors.priority}</span>}
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="tags">Tags (comma-separated)</label>
                <input
                  type="text"
                  id="tags"
                  value={formData.tags.join(', ')}
                  onChange={handleTagsChange}
                  placeholder="e.g., blog, article, news"
                />
              </div>

              <div className="form-group">
                <label>
                  <input
                    type="checkbox"
                    name="isDefault"
                    checked={formData.isDefault}
                    onChange={handleInputChange}
                  />
                  Set as default profile
                </label>
              </div>

              <div className="settings-section">
                <h3>Editor Settings</h3>
                
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="height">Height (px)</label>
                    <input
                      type="number"
                      id="height"
                      value={formData.settings.height}
                      onChange={(e) => handleSettingsChange('height', parseInt(e.target.value))}
                      min="200"
                      max="800"
                    />
                  </div>

                  <div className="form-group">
                    <label>
                      <input
                        type="checkbox"
                        checked={formData.settings.menubar}
                        onChange={(e) => handleSettingsChange('menubar', e.target.checked)}
                      />
                      Show Menu Bar
                    </label>
                  </div>

                  <div className="form-group">
                    <label>
                      <input
                        type="checkbox"
                        checked={formData.settings.statusbar}
                        onChange={(e) => handleSettingsChange('statusbar', e.target.checked)}
                      />
                      Show Status Bar
                    </label>
                  </div>
                </div>

                <div className="form-group">
                  <label>Plugins</label>
                  <div className="plugins-grid">
                    {AVAILABLE_PLUGINS.map(plugin => (
                      <label key={plugin} className="plugin-checkbox">
                        <input
                          type="checkbox"
                          checked={formData.settings.plugins.includes(plugin)}
                          onChange={(e) => handlePluginsChange(plugin, e.target.checked)}
                          disabled={plugin === 'pagebreak'} // Pagebreak is always enabled
                        />
                        <span className={plugin === 'pagebreak' ? 'required' : ''}>{plugin}</span>
                      </label>
                    ))}
                  </div>
                  <p className="help-text">The pagebreak plugin is always enabled and cannot be disabled.</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'toolbar' && (
            <TinymceToolbarConfig
              toolbar={formData.settings.toolbar}
              onChange={handleToolbarChange}
            />
          )}

          {activeTab === 'tags' && (
            <TinymceTagManager
              tags={allowedTags}
              onChange={handleAllowedTagsChange}
            />
          )}

          {activeTab === 'features' && (
            <TinymceFeatureManager
              features={features}
              onChange={handleFeaturesChange}
            />
          )}
        </div>

        <div className="form-actions">
          <button type="button" className="btn-secondary" onClick={onCancel}>
            Cancel
          </button>
          <button type="submit" className="btn-primary">
            {profile ? 'Update Profile' : 'Create Profile'}
          </button>
        </div>
      </form>

      <style>{`
        .profile-editor {
          background: white;
          border-radius: 8px;
          padding: 0;
          max-width: 1200px;
          margin: 0 auto;
        }

        .editor-header {
          padding: 20px;
          border-bottom: 1px solid #e0e0e0;
        }

        .editor-header h2 {
          margin: 0;
          color: #333;
        }

        .tabs {
          display: flex;
          border-bottom: 1px solid #e0e0e0;
          background: #f8f9fa;
        }

        .tab {
          padding: 15px 25px;
          background: none;
          border: none;
          cursor: pointer;
          font-size: 14px;
          color: #666;
          border-bottom: 3px solid transparent;
          transition: all 0.2s;
        }

        .tab:hover {
          color: #333;
          background: #f0f0f0;
        }

        .tab.active {
          color: #007bff;
          border-bottom-color: #007bff;
          background: white;
        }

        .tab-content {
          padding: 30px;
          min-height: 400px;
        }

        .form-group {
          margin-bottom: 20px;
        }

        .form-group label {
          display: block;
          margin-bottom: 5px;
          font-weight: 500;
          color: #333;
        }

        .form-group input[type="text"],
        .form-group input[type="number"],
        .form-group select,
        .form-group textarea {
          width: 100%;
          padding: 8px 12px;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 14px;
        }

        .form-group input[type="checkbox"] {
          margin-right: 8px;
        }

        .form-group input.error,
        .form-group select.error {
          border-color: #dc3545;
        }

        .error-message {
          color: #dc3545;
          font-size: 12px;
          margin-top: 4px;
          display: block;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }

        .settings-section {
          margin-top: 40px;
          padding-top: 30px;
          border-top: 1px solid #e0e0e0;
        }

        .settings-section h3 {
          margin-bottom: 20px;
          color: #333;
        }

        .plugins-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
          gap: 10px;
          margin-top: 10px;
        }

        .plugin-checkbox {
          display: flex;
          align-items: center;
          cursor: pointer;
        }

        .plugin-checkbox input[type="checkbox"] {
          margin-right: 5px;
        }

        .plugin-checkbox span.required {
          font-weight: 600;
          color: #28a745;
        }

        .help-text {
          font-size: 12px;
          color: #666;
          margin-top: 10px;
          font-style: italic;
        }

        .form-actions {
          display: flex;
          justify-content: flex-end;
          gap: 10px;
          padding: 20px;
          border-top: 1px solid #e0e0e0;
          background: #f8f9fa;
        }

        .btn-primary,
        .btn-secondary {
          padding: 10px 20px;
          border: none;
          border-radius: 4px;
          font-size: 14px;
          cursor: pointer;
          transition: background-color 0.2s;
        }

        .btn-primary {
          background: #007bff;
          color: white;
        }

        .btn-primary:hover {
          background: #0056b3;
        }

        .btn-secondary {
          background: #6c757d;
          color: white;
        }

        .btn-secondary:hover {
          background: #5a6268;
        }
      `}</style>
    </div>
  );
};

export default TinymceProfileEditor;
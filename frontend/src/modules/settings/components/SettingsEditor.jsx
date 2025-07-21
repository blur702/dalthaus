import React, { useState, useEffect } from 'react';
import './SettingsEditor.css';

const SettingsEditor = ({ setting, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    settings: {},
    tags: [],
    isDefault: false
  });
  
  const [tagInput, setTagInput] = useState('');
  const [activeTab, setActiveTab] = useState('basic');

  const availablePlugins = [
    { value: 'advlist', label: 'Advanced List' },
    { value: 'anchor', label: 'Anchor' },
    { value: 'autolink', label: 'Auto Link' },
    { value: 'charmap', label: 'Character Map' },
    { value: 'code', label: 'Source Code' },
    { value: 'codesample', label: 'Code Sample' },
    { value: 'fullscreen', label: 'Fullscreen' },
    { value: 'image', label: 'Image' },
    { value: 'insertdatetime', label: 'Insert Date/Time' },
    { value: 'link', label: 'Link' },
    { value: 'lists', label: 'Lists' },
    { value: 'media', label: 'Media' },
    { value: 'pagebreak', label: 'Page Break' },
    { value: 'preview', label: 'Preview' },
    { value: 'searchreplace', label: 'Search & Replace' },
    { value: 'table', label: 'Table' },
    { value: 'visualblocks', label: 'Visual Blocks' },
    { value: 'wordcount', label: 'Word Count' }
  ];

  const toolbarButtons = [
    { value: 'undo redo', label: 'Undo/Redo' },
    { value: 'bold italic', label: 'Bold/Italic' },
    { value: 'forecolor backcolor', label: 'Text Color' },
    { value: 'alignleft aligncenter alignright alignjustify', label: 'Alignment' },
    { value: 'bullist numlist', label: 'Lists' },
    { value: 'outdent indent', label: 'Indent' },
    { value: 'link image media', label: 'Media' },
    { value: 'pagebreak', label: 'Page Break' },
    { value: 'table', label: 'Table' },
    { value: 'removeformat', label: 'Remove Format' },
    { value: 'code', label: 'Source Code' },
    { value: 'blocks', label: 'Block Formats' },
    { value: 'formatselect', label: 'Format Select' }
  ];

  useEffect(() => {
    if (setting) {
      setFormData({
        name: setting.name || '',
        description: setting.description || '',
        settings: setting.settings || {},
        tags: setting.tags || [],
        isDefault: setting.isDefault || false
      });
    }
  }, [setting]);

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSettingChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      settings: {
        ...prev.settings,
        [field]: value
      }
    }));
  };

  const handlePluginToggle = (plugin) => {
    const currentPlugins = Array.isArray(formData.settings.plugins) ? formData.settings.plugins : [];
    const newPlugins = currentPlugins.includes(plugin)
      ? currentPlugins.filter(p => p !== plugin)
      : [...currentPlugins, plugin];
    
    handleSettingChange('plugins', newPlugins);
  };

  const handleToolbarChange = (toolbar) => {
    const currentToolbar = formData.settings.toolbar || '';
    const toolbarArray = currentToolbar.split(' | ').filter(Boolean);
    
    if (toolbarArray.includes(toolbar)) {
      const newToolbar = toolbarArray.filter(t => t !== toolbar).join(' | ');
      handleSettingChange('toolbar', newToolbar);
    } else {
      const newToolbar = [...toolbarArray, toolbar].join(' | ');
      handleSettingChange('toolbar', newToolbar);
    }
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      handleChange('tags', [...formData.tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tag) => {
    handleChange('tags', formData.tags.filter(t => t !== tag));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleJsonEdit = (jsonString) => {
    try {
      const parsed = JSON.parse(jsonString);
      handleSettingChange('settings', parsed);
    } catch (e) {
      console.error('Invalid JSON:', e);
    }
  };

  return (
    <div className="settings-editor">
      <form onSubmit={handleSubmit}>
        <div className="editor-header">
          <h3>{setting?.id ? 'Edit Settings' : 'Create New Settings'}</h3>
        </div>

        <div className="editor-tabs">
          <button
            type="button"
            className={`tab ${activeTab === 'basic' ? 'active' : ''}`}
            onClick={() => setActiveTab('basic')}
          >
            Basic Info
          </button>
          <button
            type="button"
            className={`tab ${activeTab === 'editor' ? 'active' : ''}`}
            onClick={() => setActiveTab('editor')}
          >
            Editor Config
          </button>
          <button
            type="button"
            className={`tab ${activeTab === 'advanced' ? 'active' : ''}`}
            onClick={() => setActiveTab('advanced')}
          >
            Advanced
          </button>
          <button
            type="button"
            className={`tab ${activeTab === 'json' ? 'active' : ''}`}
            onClick={() => setActiveTab('json')}
          >
            JSON Editor
          </button>
        </div>

        <div className="editor-content">
          {activeTab === 'basic' && (
            <div className="tab-content">
              <div className="form-group">
                <label htmlFor="name">Name *</label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  required
                  placeholder="e.g., Blog Editor"
                />
              </div>

              <div className="form-group">
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                  rows={3}
                  placeholder="Describe what this configuration is for"
                />
              </div>

              <div className="form-group">
                <label>Tags</label>
                <div className="tags-input">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                    placeholder="Add a tag and press Enter"
                  />
                  <button type="button" onClick={handleAddTag} className="btn btn-sm">Add</button>
                </div>
                <div className="tags-list">
                  {formData.tags.map((tag, index) => (
                    <span key={index} className="tag-item">
                      {tag}
                      <button type="button" onClick={() => handleRemoveTag(tag)}>×</button>
                    </span>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label>
                  <input
                    type="checkbox"
                    checked={formData.isDefault}
                    onChange={(e) => handleChange('isDefault', e.target.checked)}
                  />
                  Set as default configuration
                </label>
              </div>
            </div>
          )}

          {activeTab === 'editor' && (
            <div className="tab-content">
              <div className="form-group">
                <label htmlFor="height">Height (px)</label>
                <input
                  type="number"
                  id="height"
                  value={formData.settings.height || 400}
                  onChange={(e) => handleSettingChange('height', parseInt(e.target.value))}
                  min="100"
                  max="1000"
                />
              </div>

              <div className="form-group">
                <label>
                  <input
                    type="checkbox"
                    checked={formData.settings.menubar !== false}
                    onChange={(e) => handleSettingChange('menubar', e.target.checked)}
                  />
                  Show Menu Bar
                </label>
              </div>

              <div className="form-group">
                <label>Plugins</label>
                <div className="checkbox-grid">
                  {availablePlugins.map(plugin => (
                    <label key={plugin.value} className="checkbox-item">
                      <input
                        type="checkbox"
                        checked={formData.settings.plugins?.includes(plugin.value) || false}
                        onChange={() => handlePluginToggle(plugin.value)}
                      />
                      {plugin.label}
                    </label>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label>Toolbar Buttons</label>
                <div className="checkbox-grid">
                  {toolbarButtons.map(button => (
                    <label key={button.value} className="checkbox-item">
                      <input
                        type="checkbox"
                        checked={formData.settings.toolbar?.includes(button.value) || false}
                        onChange={() => handleToolbarChange(button.value)}
                      />
                      {button.label}
                    </label>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="contentStyle">Content CSS</label>
                <textarea
                  id="contentStyle"
                  value={formData.settings.content_style || ''}
                  onChange={(e) => handleSettingChange('content_style', e.target.value)}
                  rows={4}
                  placeholder="body { font-family: Arial, sans-serif; }"
                />
              </div>
            </div>
          )}

          {activeTab === 'advanced' && (
            <div className="tab-content">
              <div className="form-group">
                <label>
                  <input
                    type="checkbox"
                    checked={formData.settings.relative_urls === false}
                    onChange={(e) => handleSettingChange('relative_urls', !e.target.checked)}
                  />
                  Use Absolute URLs
                </label>
              </div>

              <div className="form-group">
                <label>
                  <input
                    type="checkbox"
                    checked={formData.settings.automatic_uploads === true}
                    onChange={(e) => handleSettingChange('automatic_uploads', e.target.checked)}
                  />
                  Automatic Image Uploads
                </label>
              </div>

              <div className="form-group">
                <label htmlFor="blockFormats">Block Formats</label>
                <input
                  type="text"
                  id="blockFormats"
                  value={formData.settings.block_formats || ''}
                  onChange={(e) => handleSettingChange('block_formats', e.target.value)}
                  placeholder="Paragraph=p; Header 1=h1; Header 2=h2"
                />
              </div>

              <div className="form-group">
                <label htmlFor="pagebreakSeparator">Page Break Separator</label>
                <input
                  type="text"
                  id="pagebreakSeparator"
                  value={formData.settings.pagebreak_separator || ''}
                  onChange={(e) => handleSettingChange('pagebreak_separator', e.target.value)}
                  placeholder="<!-- pagebreak -->"
                />
              </div>

              <div className="form-group">
                <label htmlFor="forcedRootBlock">Forced Root Block</label>
                <input
                  type="text"
                  id="forcedRootBlock"
                  value={formData.settings.forced_root_block || ''}
                  onChange={(e) => handleSettingChange('forced_root_block', e.target.value)}
                  placeholder="p"
                />
              </div>
            </div>
          )}

          {activeTab === 'json' && (
            <div className="tab-content">
              <div className="form-group">
                <label>Edit Configuration (JSON)</label>
                <textarea
                  value={JSON.stringify(formData.settings, null, 2)}
                  onChange={(e) => handleJsonEdit(e.target.value)}
                  rows={20}
                  className="json-editor"
                />
              </div>
            </div>
          )}
        </div>

        <div className="editor-footer">
          <button type="button" onClick={onCancel} className="btn btn-secondary">
            Cancel
          </button>
          <button type="submit" className="btn btn-primary">
            Save Settings
          </button>
        </div>
      </form>
    </div>
  );
};

export default SettingsEditor;
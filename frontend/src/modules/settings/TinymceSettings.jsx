import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../../components/AdminLayout';
import axios from 'axios';
import SettingsList from './components/SettingsList';
import SettingsEditor from './components/SettingsEditor';
import SettingsPreview from './components/SettingsPreview';
import './TinymceSettings.css';

const TinymceSettings = ({ setIsAuthenticated }) => {
  const [settings, setSettings] = useState([]);
  const [selectedSetting, setSelectedSetting] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();
  const timeoutRef = useRef(null);

  useEffect(() => {
    fetchSettings();
    
    // Cleanup function to clear timeout on unmount
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/admin/tinymce-settings', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSettings(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching settings:', err);
      setError('Failed to load settings');
      if (err.response?.status === 401) {
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSelectSetting = (setting) => {
    setSelectedSetting(setting);
    setEditMode(false);
    setPreviewMode(false);
  };

  const handleCreateNew = () => {
    const newSetting = {
      name: '',
      description: '',
      settings: {
        height: 400,
        menubar: true,
        plugins: ['lists', 'link', 'image', 'code'],
        toolbar: 'undo redo | bold italic | alignleft aligncenter alignright | bullist numlist | link image | code',
        content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
      },
      tags: [],
      isDefault: false
    };
    setSelectedSetting(newSetting);
    setEditMode(true);
    setPreviewMode(false);
  };

  const handleEdit = () => {
    setEditMode(true);
    setPreviewMode(false);
  };

  const handlePreview = () => {
    setPreviewMode(true);
    setEditMode(false);
  };

  const handleSave = async (settingData) => {
    try {
      const token = localStorage.getItem('token');
      let response;
      
      if (selectedSetting.id) {
        response = await axios.put(
          `/api/admin/tinymce-settings/${selectedSetting.id}`,
          settingData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        response = await axios.post(
          '/api/admin/tinymce-settings',
          settingData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }
      
      setSuccessMessage('Settings saved successfully!');
      setEditMode(false);
      fetchSettings();
      setSelectedSetting(response.data);
      
      // Clear any existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      
      // Set new timeout
      timeoutRef.current = setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error('Error saving settings:', err);
      setError(err.response?.data?.error || 'Failed to save settings');
    }
  };

  const handleDuplicate = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `/api/admin/tinymce-settings/${selectedSetting.id}/duplicate`,
        { name: `${selectedSetting.name} (Copy)` },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setSuccessMessage('Settings duplicated successfully!');
      fetchSettings();
      setSelectedSetting(response.data);
      
      // Clear any existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      
      // Set new timeout
      timeoutRef.current = setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error('Error duplicating settings:', err);
      setError(err.response?.data?.error || 'Failed to duplicate settings');
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this setting?')) {
      return;
    }
    
    try {
      const token = localStorage.getItem('token');
      await axios.delete(
        `/api/admin/tinymce-settings/${selectedSetting.id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setSuccessMessage('Settings deleted successfully!');
      setSelectedSetting(null);
      fetchSettings();
      
      // Clear any existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      
      // Set new timeout
      timeoutRef.current = setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error('Error deleting settings:', err);
      setError(err.response?.data?.error || 'Failed to delete settings');
    }
  };

  const handleExport = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `/api/admin/tinymce-settings/${selectedSetting.id}/export`,
        { 
          headers: { Authorization: `Bearer ${token}` },
          responseType: 'blob'
        }
      );
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${selectedSetting.name.replace(/[^a-z0-9]/gi, '_')}_tinymce_settings.json`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      setSuccessMessage('Settings exported successfully!');
      
      // Clear any existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      
      // Set new timeout
      timeoutRef.current = setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error('Error exporting settings:', err);
      setError('Failed to export settings');
    }
  };

  const handleImport = async (file) => {
    try {
      const fileContent = await file.text();
      const importData = JSON.parse(fileContent);
      
      const token = localStorage.getItem('token');
      const response = await axios.post(
        '/api/admin/tinymce-settings/import',
        importData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setSuccessMessage('Settings imported successfully!');
      fetchSettings();
      setSelectedSetting(response.data);
      
      // Clear any existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      
      // Set new timeout
      timeoutRef.current = setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error('Error importing settings:', err);
      setError(err.response?.data?.error || 'Failed to import settings. Please check the file format.');
    }
  };

  const handleSetDefault = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `/api/admin/tinymce-settings/${selectedSetting.id}`,
        { ...selectedSetting, isDefault: true },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setSuccessMessage('Default settings updated!');
      fetchSettings();
      
      // Clear any existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      
      // Set new timeout
      timeoutRef.current = setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error('Error setting default:', err);
      setError('Failed to set as default');
    }
  };

  return (
    <AdminLayout setIsAuthenticated={setIsAuthenticated}>
      <div className="tinymce-settings">
        <div className="page-header">
          <h2>TinyMCE Editor Settings</h2>
          <p>Configure and manage editor presets for different use cases</p>
        </div>

        {error && (
          <div className="alert alert-error">
            {error}
            <button onClick={() => setError(null)} className="alert-close">×</button>
          </div>
        )}

        {successMessage && (
          <div className="alert alert-success">
            {successMessage}
          </div>
        )}

        {loading ? (
          <div className="loading-spinner">Loading settings...</div>
        ) : (
          <div className="settings-container">
            <div className="settings-sidebar">
              <SettingsList
                settings={settings}
                selectedSetting={selectedSetting}
                onSelectSetting={handleSelectSetting}
                onCreateNew={handleCreateNew}
                onImport={handleImport}
              />
            </div>

            <div className="settings-main">
              {selectedSetting ? (
                <>
                  {editMode ? (
                    <SettingsEditor
                      setting={selectedSetting}
                      onSave={handleSave}
                      onCancel={() => setEditMode(false)}
                    />
                  ) : previewMode ? (
                    <SettingsPreview
                      setting={selectedSetting}
                      onClose={() => setPreviewMode(false)}
                    />
                  ) : (
                    <div className="settings-detail">
                      <div className="detail-header">
                        <h3>{selectedSetting.name}</h3>
                        {selectedSetting.isDefault && (
                          <span className="badge badge-primary">Default</span>
                        )}
                        {selectedSetting.isPreset && (
                          <span className="badge badge-secondary">Preset</span>
                        )}
                      </div>

                      <p className="detail-description">{selectedSetting.description}</p>

                      {selectedSetting.tags && selectedSetting.tags.length > 0 && (
                        <div className="detail-tags">
                          {selectedSetting.tags.map((tag, index) => (
                            <span key={index} className="tag">{tag}</span>
                          ))}
                        </div>
                      )}

                      <div className="detail-actions">
                        <button
                          onClick={handlePreview}
                          className="btn btn-secondary"
                        >
                          Preview
                        </button>
                        
                        {!selectedSetting.isPreset && (
                          <>
                            <button
                              onClick={handleEdit}
                              className="btn btn-primary"
                            >
                              Edit
                            </button>
                            
                            {!selectedSetting.isDefault && (
                              <button
                                onClick={handleSetDefault}
                                className="btn btn-secondary"
                              >
                                Set as Default
                              </button>
                            )}
                            
                            <button
                              onClick={handleDelete}
                              className="btn btn-danger"
                            >
                              Delete
                            </button>
                          </>
                        )}
                        
                        <button
                          onClick={handleDuplicate}
                          className="btn btn-secondary"
                        >
                          Duplicate
                        </button>
                        
                        <button
                          onClick={handleExport}
                          className="btn btn-secondary"
                        >
                          Export
                        </button>
                      </div>

                      <div className="settings-json">
                        <h4>Configuration</h4>
                        <pre>{JSON.stringify(selectedSetting.settings, null, 2)}</pre>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="no-selection">
                  <p>Select a setting from the list or create a new one</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default TinymceSettings;
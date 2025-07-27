import React, { useState, useEffect, useRef } from 'react';
import AdminLayout from '../../components/AdminLayout';
import TinymceProfileEditor from './TinymceProfileEditor';
import { profileService } from './tinymceService';
import api from '../../services/api';

const TinymceSettings = ({ setIsAuthenticated }) => {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [showEditor, setShowEditor] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [defaultProfileId, setDefaultProfileId] = useState(null);
  const [isSettingDefault, setIsSettingDefault] = useState(false);
  const timeoutRef = useRef(null);

  useEffect(() => {
    loadProfiles();
    loadDefaultProfile();
    
    // Cleanup function to clear timeout on unmount
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const loadProfiles = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await profileService.getAll();
      setProfiles(data || []);
    } catch (err) {
      setError(err.message || 'Failed to load profiles');
    } finally {
      setLoading(false);
    }
  };

  const loadDefaultProfile = async () => {
    try {
      const response = await api.get('/tinymce/default-profile');
      setDefaultProfileId(response.data.profileId);
    } catch (error) {
      console.error('Error loading default profile:', error);
    }
  };

  const handleSetDefaultProfile = async (profileId) => {
    setIsSettingDefault(true);
    setError('');
    setSuccessMessage('');
    
    try {
      const response = await api.put('/tinymce/default-profile', { profileId });
      setDefaultProfileId(profileId);
      setSuccessMessage(response.data.message);
      
      // Clear any existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      
      // Set new timeout
      timeoutRef.current = setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to set default profile');
    } finally {
      setIsSettingDefault(false);
    }
  };

  const handleCreate = () => {
    setSelectedProfile(null);
    setShowEditor(true);
  };

  const handleEdit = async (profile) => {
    try {
      // Get full profile details
      const fullProfile = await profileService.getById(profile.id);
      setSelectedProfile(fullProfile);
      setShowEditor(true);
    } catch (err) {
      setError(err.message || 'Failed to load profile details');
    }
  };

  const handleSave = async (profileData) => {
    try {
      if (selectedProfile) {
        await profileService.update(selectedProfile.id, profileData);
        setSuccessMessage('Profile updated successfully');
      } else {
        await profileService.create(profileData);
        setSuccessMessage('Profile created successfully');
      }
      
      setShowEditor(false);
      loadProfiles();
      
      // Clear any existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      
      // Set new timeout
      timeoutRef.current = setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setError(err.message || 'Failed to save profile');
    }
  };

  const handleDelete = async (profile) => {
    if (profile.isLocked) {
      setError('This profile is locked and cannot be deleted');
      return;
    }
    
    if (profile.isPreset) {
      setError('System preset profiles cannot be deleted');
      return;
    }

    if (window.confirm(`Are you sure you want to delete "${profile.name}"?`)) {
      try {
        await profileService.delete(profile.id);
        setSuccessMessage('Profile deleted successfully');
        loadProfiles();
        
        // Clear any existing timeout
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
        
        // Set new timeout
        timeoutRef.current = setTimeout(() => setSuccessMessage(''), 3000);
      } catch (err) {
        setError(err.message || 'Failed to delete profile');
      }
    }
  };

  const handleDuplicate = async (profile) => {
    const newName = prompt(`Enter a name for the duplicate of "${profile.name}":`, `${profile.name} (Copy)`);
    if (newName && newName.trim()) {
      try {
        await profileService.duplicate(profile.id, newName.trim());
        setSuccessMessage('Profile duplicated successfully');
        loadProfiles();
        
        // Clear any existing timeout
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
        
        // Set new timeout
        timeoutRef.current = setTimeout(() => setSuccessMessage(''), 3000);
      } catch (err) {
        setError(err.message || 'Failed to duplicate profile');
      }
    }
  };

  const handleViewConfig = async (profile) => {
    try {
      const config = await profileService.getConfig(profile.id);
      const configJson = JSON.stringify(config, null, 2);
      
      // Create a modal or new window to show the configuration
      const configWindow = window.open('', '_blank', 'width=800,height=600');
      configWindow.document.write(`
        <html>
          <head>
            <title>TinyMCE Configuration - ${profile.name}</title>
            <style>
              body { font-family: monospace; padding: 20px; }
              pre { background: #f5f5f5; padding: 15px; border-radius: 5px; overflow: auto; }
              .copy-btn { margin-bottom: 10px; padding: 5px 15px; background: #007bff; color: white; border: none; border-radius: 3px; cursor: pointer; }
              .copy-btn:hover { background: #0056b3; }
            </style>
          </head>
          <body>
            <h2>TinyMCE Configuration for "${profile.name}"</h2>
            <button class="copy-btn" onclick="navigator.clipboard.writeText(document.querySelector('pre').textContent)">Copy Configuration</button>
            <pre>${configJson}</pre>
          </body>
        </html>
      `);
    } catch (err) {
      setError(err.message || 'Failed to get configuration');
    }
  };

  if (showEditor) {
    return (
      <AdminLayout setIsAuthenticated={setIsAuthenticated}>
        <div className="tinymce-settings">
          <TinymceProfileEditor
            profile={selectedProfile}
            onSave={handleSave}
            onCancel={() => setShowEditor(false)}
          />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout setIsAuthenticated={setIsAuthenticated}>
      <div className="tinymce-settings">
        <div className="page-header">
          <h2>TinyMCE Configuration</h2>
          <button className="btn-primary" onClick={handleCreate}>
            Create New Profile
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
          <div className="loading">Loading profiles...</div>
        ) : profiles.length === 0 ? (
          <div className="no-content">
            <p>No profiles found.</p>
            <button className="btn-primary" onClick={handleCreate}>
              Create Your First Profile
            </button>
          </div>
        ) : (
          <div className="profiles-section">
            <h3>Editor Profiles</h3>
            <p className="section-description">
              Manage TinyMCE editor profiles for different content types and user roles.
            </p>
            
            <div className="profiles-grid">
              {profiles.map(profile => (
                <div key={profile.id} className="profile-card">
                  <div className="profile-header">
                    <h4>{profile.name}</h4>
                    {profile.isDefault && (
                      <span className="badge badge-primary">Default</span>
                    )}
                    {profile.isPreset && (
                      <span className="badge badge-secondary">System</span>
                    )}
                    {profile.isLocked && (
                      <span className="badge badge-warning">Locked</span>
                    )}
                  </div>
                  
                  <p className="profile-description">{profile.description || 'No description'}</p>
                  
                  <div className="profile-meta">
                    <span className="meta-item">
                      <strong>Type:</strong> {profile.profileType}
                    </span>
                    <span className="meta-item">
                      <strong>Priority:</strong> {profile.priority}
                    </span>
                  </div>
                  
                  {profile.tags && profile.tags.length > 0 && (
                    <div className="profile-tags">
                      {profile.tags.map((tag, index) => (
                        <span key={index} className="tag">{tag}</span>
                      ))}
                    </div>
                  )}
                  
                  <div className="profile-actions">
                    <button
                      className="btn-sm btn-secondary"
                      onClick={() => handleViewConfig(profile)}
                      title="View compiled configuration"
                    >
                      View Config
                    </button>
                    <button
                      className="btn-sm btn-primary"
                      onClick={() => handleEdit(profile)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn-sm btn-secondary"
                      onClick={() => handleDuplicate(profile)}
                      title="Create a copy of this profile"
                    >
                      Duplicate
                    </button>
                    {!profile.isPreset && !profile.isLocked && (
                      <button
                        className="btn-sm btn-danger"
                        onClick={() => handleDelete(profile)}
                      >
                        Delete
                      </button>
                    )}
                    <button
                      className={`btn-sm ${defaultProfileId === profile.id ? 'btn-success' : 'btn-outline'}`}
                      onClick={() => handleSetDefaultProfile(profile.id)}
                      disabled={isSettingDefault || defaultProfileId === profile.id}
                      title={defaultProfileId === profile.id ? "This is the default profile for all content types" : "Set as default for all content types"}
                    >
                      {defaultProfileId === profile.id ? '✓ Default' : 'Set Default'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        <style>{`
          .tinymce-settings {
            padding: 20px;
          }
          
          .profiles-section {
            margin-top: 30px;
          }
          
          .section-description {
            color: #666;
            margin-bottom: 20px;
          }
          
          .profiles-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
            gap: 20px;
          }
          
          .profile-card {
            background: white;
            border: 1px solid #e0e0e0;
            border-radius: 8px;
            padding: 20px;
            transition: box-shadow 0.2s;
          }
          
          .profile-card:hover {
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          }
          
          .profile-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 10px;
          }
          
          .profile-header h4 {
            margin: 0;
            font-size: 18px;
            color: #333;
          }
          
          .badge {
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 12px;
            font-weight: 500;
          }
          
          .badge-primary {
            background: #007bff;
            color: white;
          }
          
          .badge-secondary {
            background: #6c757d;
            color: white;
          }
          
          .badge-warning {
            background: #ffc107;
            color: #212529;
          }
          
          .profile-description {
            color: #666;
            margin-bottom: 15px;
            font-size: 14px;
          }
          
          .profile-meta {
            display: flex;
            gap: 20px;
            margin-bottom: 15px;
            font-size: 13px;
          }
          
          .meta-item {
            color: #666;
          }
          
          .meta-item strong {
            color: #333;
          }
          
          .profile-tags {
            display: flex;
            flex-wrap: wrap;
            gap: 5px;
            margin-bottom: 15px;
          }
          
          .tag {
            background: #f0f0f0;
            padding: 3px 8px;
            border-radius: 3px;
            font-size: 12px;
            color: #666;
          }
          
          .profile-actions {
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
            margin-top: 15px;
          }
          
          .btn-sm {
            padding: 5px 15px;
            font-size: 13px;
            border: none;
            border-radius: 4px;
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
          
          .btn-danger {
            background: #dc3545;
            color: white;
          }
          
          .btn-danger:hover {
            background: #c82333;
          }
          
          .btn-success {
            background: #28a745;
            color: white;
          }
          
          .btn-success:hover {
            background: #218838;
          }
          
          .btn-outline {
            background: white;
            color: #6c757d;
            border: 1px solid #6c757d;
          }
          
          .btn-outline:hover {
            background: #f8f9fa;
          }
          
          .btn-sm:disabled {
            opacity: 0.6;
            cursor: not-allowed;
          }
        `}</style>
      </div>
    </AdminLayout>
  );
};

export default TinymceSettings;
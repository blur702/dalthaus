import React, { useState, useEffect } from 'react';
import tinymceService from '../modules/settings/tinymceService';

const TinymceProfileSelector = ({ 
  value, 
  onChange, 
  contentType = null,
  disabled = false,
  showContentTypes = true
}) => {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        setLoading(true);
        const data = await tinymceService.getProfiles();
        setProfiles(data);
        
        // Auto-select default profile for content type if no value is set
        if (!value && contentType) {
          const defaultProfile = data.find(p => 
            p.content_types?.includes(contentType) && p.is_default
          );
          if (defaultProfile) {
            onChange(defaultProfile.id);
          }
        }
      } catch (err) {
        console.error('Error fetching profiles:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfiles();
  }, [contentType, value, onChange]);

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <div className="spinner" style={{ 
          width: '20px', 
          height: '20px', 
          border: '3px solid #f3f3f3',
          borderTop: '3px solid #3498db',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }}></div>
        <style dangerouslySetInnerHTML={{ __html: `
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}} />
        <span>Loading profiles...</span>
      </div>
    );
  }

  if (error) {
    return null; // Silently fail, will use default config
  }

  return (
    <div style={{ marginBottom: '16px' }}>
      <label htmlFor="tinymce-profile" style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
        Editor Profile
      </label>
      <select
        id="tinymce-profile"
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        style={{
          width: '100%',
          padding: '8px 12px',
          fontSize: '14px',
          border: '1px solid #ccc',
          borderRadius: '4px',
          backgroundColor: disabled ? '#f5f5f5' : 'white',
          cursor: disabled ? 'not-allowed' : 'pointer'
        }}
      >
        <option value="">Default</option>
        {profiles.map((profile) => (
          <option key={profile.id} value={profile.id}>
            {profile.name}
            {profile.is_default && ' (Default)'}
            {showContentTypes && profile.content_types?.length > 0 && 
              ` - ${profile.content_types.join(', ')}`
            }
          </option>
        ))}
      </select>
    </div>
  );
};

export default TinymceProfileSelector;
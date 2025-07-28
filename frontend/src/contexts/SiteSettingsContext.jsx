import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const SiteSettingsContext = createContext();

export const useSiteSettings = () => {
  const context = useContext(SiteSettingsContext);
  if (!context) {
    throw new Error('useSiteSettings must be used within a SiteSettingsProvider');
  }
  return context;
};

export const SiteSettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState({
    siteName: 'My CMS Site',
    siteDescription: 'A powerful content management system',
    faviconUrl: null,
    metaKeywords: null,
    metaAuthor: null,
    copyrightText: null,
    googleAnalyticsId: null,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const response = await api.get('/settings/public');
      if (response.data) {
        setSettings(response.data);
      }
    } catch (err) {
      setError('Failed to load site settings');
      console.error('Error fetching site settings:', err);
    } finally {
      setLoading(false);
    }
  };

  // Update document title when site name changes
  useEffect(() => {
    if (settings.siteName) {
      document.title = settings.siteName;
    }
  }, [settings.siteName]);

  // Update meta tags
  useEffect(() => {
    // Update meta description
    if (settings.siteDescription) {
      let metaDescription = document.querySelector('meta[name="description"]');
      if (!metaDescription) {
        metaDescription = document.createElement('meta');
        metaDescription.name = 'description';
        document.head.appendChild(metaDescription);
      }
      metaDescription.content = settings.siteDescription;
    }

    // Update meta keywords
    if (settings.metaKeywords) {
      let metaKeywords = document.querySelector('meta[name="keywords"]');
      if (!metaKeywords) {
        metaKeywords = document.createElement('meta');
        metaKeywords.name = 'keywords';
        document.head.appendChild(metaKeywords);
      }
      metaKeywords.content = settings.metaKeywords;
    }

    // Update meta author
    if (settings.metaAuthor) {
      let metaAuthor = document.querySelector('meta[name="author"]');
      if (!metaAuthor) {
        metaAuthor = document.createElement('meta');
        metaAuthor.name = 'author';
        document.head.appendChild(metaAuthor);
      }
      metaAuthor.content = settings.metaAuthor;
    }

    // Update favicon
    if (settings.faviconUrl) {
      let favicon = document.querySelector('link[rel="icon"]');
      if (!favicon) {
        favicon = document.createElement('link');
        favicon.rel = 'icon';
        document.head.appendChild(favicon);
      }
      favicon.href = settings.faviconUrl;
    }
  }, [settings]);

  const value = {
    settings,
    loading,
    error,
    refreshSettings: fetchSettings,
  };

  return (
    <SiteSettingsContext.Provider value={value}>
      {children}
    </SiteSettingsContext.Provider>
  );
};
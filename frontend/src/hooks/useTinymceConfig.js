import { useState, useEffect, useCallback } from 'react';
import tinymceService from '../modules/settings/tinymceService';

// Cache to store fetched configurations
const configCache = new Map();

// Default configuration fallback
const DEFAULT_CONFIG = {
  license_key: 'gpl', // Use GPL license
  toolbar: 'undo redo | blocks | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image | removeformat | pagebreak | help',
  plugins: 'link image lists pagebreak help preview searchreplace wordcount visualblocks visualchars code fullscreen insertdatetime media table emoticons',
  menubar: true,
  statusbar: true,
  branding: false,
  height: 500,
  content_style: 'body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; font-size: 14px; }',
  pagebreak_separator: '<div class="pagebreak" style="page-break-after: always; margin: 20px 0; border-top: 2px dashed #ccc; text-align: center; color: #999;"><span style="position: relative; top: -12px; background: white; padding: 0 10px;">Page Break</span></div>',
  pagebreak_split_block: true,
  forced_root_block: 'p',
  entity_encoding: 'raw',
  valid_elements: '*[*]',
  extended_valid_elements: '*[*]',
  verify_html: false,
  cleanup_on_startup: false,
  trim_span_elements: false,
  cleanup: false,
  convert_urls: false
};

/**
 * Hook to fetch and manage TinyMCE configurations
 * @param {string} profileId - The profile ID to fetch configuration for
 * @param {object} options - Additional options
 * @param {boolean} options.useCache - Whether to use cached configurations (default: true)
 * @param {string} options.contentType - Content type for automatic profile selection
 * @returns {object} Configuration state and methods
 */
export function useTinymceConfig(profileId = null, options = {}) {
  const { useCache = true, contentType = null } = options;
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchConfig = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Check cache first
      const cacheKey = profileId || contentType || 'default';
      if (useCache && configCache.has(cacheKey)) {
        setConfig(configCache.get(cacheKey));
        setLoading(false);
        return;
      }

      // Fetch compiled configuration
      let compiledConfig;
      if (profileId) {
        compiledConfig = await tinymceService.profileService.getConfig(profileId);
      } else if (contentType) {
        // Get default profile for content type
        const profiles = await tinymceService.profileService.getAll();
        const defaultProfile = profiles.find(p => 
          p.content_types?.includes(contentType) && p.is_default
        );
        
        if (defaultProfile) {
          compiledConfig = await tinymceService.profileService.getConfig(defaultProfile.id);
        } else {
          // Use system default
          const systemDefault = profiles.find(p => p.name === 'Default');
          if (systemDefault) {
            compiledConfig = await tinymceService.profileService.getConfig(systemDefault.id);
          }
        }
      } else {
        // Get system default profile
        const profiles = await tinymceService.profileService.getAll();
        const systemDefault = profiles.find(p => p.name === 'Default');
        if (systemDefault) {
          compiledConfig = await tinymceService.profileService.getConfig(systemDefault.id);
        }
      }

      if (compiledConfig) {
        // Always ensure pagebreak plugin is included
        if (!compiledConfig.plugins.includes('pagebreak')) {
          compiledConfig.plugins = `${compiledConfig.plugins} pagebreak`;
        }

        // Ensure pagebreak is in toolbar if not already there
        if (!compiledConfig.toolbar.includes('pagebreak')) {
          compiledConfig.toolbar = `${compiledConfig.toolbar} | pagebreak`;
        }

        // Add pagebreak configuration
        compiledConfig.pagebreak_separator = DEFAULT_CONFIG.pagebreak_separator;
        compiledConfig.pagebreak_split_block = DEFAULT_CONFIG.pagebreak_split_block;
        
        // Always ensure GPL license key is set
        if (!compiledConfig.license_key) {
          compiledConfig.license_key = 'gpl';
        }

        // Cache the configuration
        if (useCache) {
          configCache.set(cacheKey, compiledConfig);
        }

        setConfig(compiledConfig);
      } else {
        // Fallback to default config
        setConfig(DEFAULT_CONFIG);
      }
    } catch (err) {
      console.error('Error fetching TinyMCE configuration:', err);
      setError(err.message);
      // Use default configuration as fallback
      setConfig(DEFAULT_CONFIG);
    } finally {
      setLoading(false);
    }
  }, [profileId, contentType, useCache]);

  useEffect(() => {
    fetchConfig();
  }, [fetchConfig]);

  const clearCache = useCallback(() => {
    configCache.clear();
  }, []);

  const refreshConfig = useCallback(() => {
    const cacheKey = profileId || contentType || 'default';
    configCache.delete(cacheKey);
    fetchConfig();
  }, [profileId, contentType, fetchConfig]);

  return {
    config,
    loading,
    error,
    refreshConfig,
    clearCache,
    isUsingFallback: error !== null
  };
}

export default useTinymceConfig;
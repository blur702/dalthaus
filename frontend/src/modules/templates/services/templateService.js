import api from '../../../services/api';

const templateService = {
  // Get all templates
  async getAllTemplates(params = {}) {
    try {
      const response = await api.get('/templates', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching templates:', error);
      throw error;
    }
  },

  // Get single template by ID or slug
  async getTemplate(id) {
    try {
      const response = await api.get(`/templates/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching template:', error);
      throw error;
    }
  },

  // Get active template by type
  async getActiveTemplate(type) {
    try {
      const response = await api.get(`/templates/active/${type}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching active template:', error);
      throw error;
    }
  },

  // Create new template
  async createTemplate(templateData) {
    try {
      const response = await api.post('/templates', templateData);
      return response.data;
    } catch (error) {
      console.error('Error creating template:', error);
      throw error;
    }
  },

  // Update template
  async updateTemplate(id, templateData) {
    try {
      const response = await api.put(`/templates/${id}`, templateData);
      return response.data;
    } catch (error) {
      console.error('Error updating template:', error);
      throw error;
    }
  },

  // Delete template
  async deleteTemplate(id) {
    try {
      const response = await api.delete(`/templates/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting template:', error);
      throw error;
    }
  },

  // Clone template
  async cloneTemplate(id, data) {
    try {
      const response = await api.post(`/templates/${id}/clone`, data);
      return response.data;
    } catch (error) {
      console.error('Error cloning template:', error);
      throw error;
    }
  },

  // Export template configuration
  async exportTemplate(id) {
    try {
      const response = await api.get(`/templates/${id}/export`);
      return response.data;
    } catch (error) {
      console.error('Error exporting template:', error);
      throw error;
    }
  },

  // Import template configuration
  async importTemplate(templateData) {
    try {
      const response = await api.post('/templates/import', templateData);
      return response.data;
    } catch (error) {
      console.error('Error importing template:', error);
      throw error;
    }
  },

  // Get global template settings
  async getGlobalSettings() {
    try {
      const response = await api.get('/templates/global-settings');
      return response.data;
    } catch (error) {
      console.error('Error fetching global settings:', error);
      throw error;
    }
  },

  // Update global template settings
  async updateGlobalSettings(settings) {
    try {
      const response = await api.put('/templates/global-settings', { settings });
      return response.data;
    } catch (error) {
      console.error('Error updating global settings:', error);
      throw error;
    }
  },

  // Helper function to build template configuration
  buildTemplateConfig(customizationData) {
    return {
      configuration: {
        siteTitle: customizationData.siteTitle,
        siteSubtitle: customizationData.siteSubtitle,
        missionTitle: customizationData.missionTitle,
        missionText: customizationData.missionText,
        showMission: customizationData.showMission,
        articlesTitle: customizationData.articlesTitle,
        photoBooksTitle: customizationData.photoBooksTitle,
        maxArticles: customizationData.maxArticles,
        maxPhotoBooks: customizationData.maxPhotoBooks,
        primaryColor: customizationData.primaryColor,
        secondaryColor: customizationData.secondaryColor,
        bannerImage: customizationData.bannerImage,
        bannerHeight: customizationData.bannerHeight,
        contentWidth: customizationData.contentWidth,
        headingFont: customizationData.headingFont,
        bodyFont: customizationData.bodyFont,
        baseFontSize: customizationData.baseFontSize,
        // New Typography options
        headingWeight: customizationData.headingWeight,
        bodyWeight: customizationData.bodyWeight,
        lineHeight: customizationData.lineHeight,
        letterSpacing: customizationData.letterSpacing,
        textTransform: customizationData.textTransform,
        // New Spacing options
        sectionSpacing: customizationData.sectionSpacing,
        elementSpacing: customizationData.elementSpacing,
        contentPadding: customizationData.contentPadding,
        cardSpacing: customizationData.cardSpacing,
        // New Layout options
        layoutVariant: customizationData.layoutVariant,
        headerAlignment: customizationData.headerAlignment,
        contentLayout: customizationData.contentLayout,
        cardStyle: customizationData.cardStyle,
      },
      headerSettings: customizationData.headerSettings || {
        headerVariant: customizationData.headerVariant || 'banner',
        showNavigation: customizationData.showNavigation !== false,
        navPosition: customizationData.navPosition || 'below',
        showMission: customizationData.showMission !== false,
        logoUrl: customizationData.logoUrl,
        headerBackgroundColor: customizationData.headerBackgroundColor || customizationData.primaryColor,
        navStyle: {
          backgroundColor: customizationData.navBackgroundColor || '#1a1a1a',
          textColor: customizationData.navTextColor || 'white',
        }
      },
      footerSettings: customizationData.footerSettings || {
        footerVariant: customizationData.footerVariant || 'detailed',
        showContactInfo: customizationData.showContactInfo !== false,
        showSocialLinks: customizationData.showSocialLinks !== false,
        footerBackgroundColor: customizationData.footerBackgroundColor || '#1a1a1a',
        footerTextColor: customizationData.footerTextColor || '#ccc',
        contactEmail: customizationData.contactEmail,
        contactPhone: customizationData.contactPhone,
        contactAddress: customizationData.contactAddress,
        socialLinks: customizationData.socialLinks || {},
        copyrightText: customizationData.copyrightText,
        footerLinks: customizationData.footerLinks || {}
      },
      layoutSettings: {
        contentWidth: customizationData.contentWidth || 'lg',
        showSidebar: customizationData.showSidebar !== false,
        sidebarPosition: customizationData.sidebarPosition || 'right',
        showBreadcrumbs: customizationData.showBreadcrumbs !== false,
        showMetaInfo: customizationData.showMetaInfo !== false,
        showCoverImage: customizationData.showCoverImage !== false,
        showAuthorBio: customizationData.showAuthorBio !== false,
        showRelatedContent: customizationData.showRelatedContent !== false,
        showTags: customizationData.showTags !== false,
        showShareButtons: customizationData.showShareButtons !== false,
      },
      globalSettings: customizationData.globalSettings || {}
    };
  },

  // Helper function to flatten template configuration for customizer
  flattenTemplateConfig(template) {
    const config = template.configuration || {};
    const headerSettings = template.headerSettings || {};
    const footerSettings = template.footerSettings || {};
    const layoutSettings = template.layoutSettings || {};
    const globalSettings = template.globalSettings || {};

    return {
      // Basic configuration
      ...config,
      
      // Enhanced header settings
      headerSettings: headerSettings,
      headerVariant: headerSettings.headerVariant,
      showNavigation: headerSettings.showNavigation,
      navPosition: headerSettings.navPosition,
      logoUrl: headerSettings.logoUrl,
      headerBackgroundColor: headerSettings.headerBackgroundColor,
      navBackgroundColor: headerSettings.navStyle?.backgroundColor,
      navTextColor: headerSettings.navStyle?.textColor,
      
      // Enhanced footer settings
      footerSettings: footerSettings,
      footerVariant: footerSettings.footerVariant,
      showContactInfo: footerSettings.showContactInfo,
      showSocialLinks: footerSettings.showSocialLinks,
      footerBackgroundColor: footerSettings.footerBackgroundColor,
      footerTextColor: footerSettings.footerTextColor,
      contactEmail: footerSettings.contactEmail,
      contactPhone: footerSettings.contactPhone,
      contactAddress: footerSettings.contactAddress,
      socialLinks: footerSettings.socialLinks,
      copyrightText: footerSettings.copyrightText,
      footerLinks: footerSettings.footerLinks,
      
      // Layout settings
      ...layoutSettings,
      
      // Global settings
      globalSettings: globalSettings,
      
      // Template type
      templateType: template.type
    };
  }
};

export default templateService;
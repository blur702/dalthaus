// Template Loader for Public Frontend
(function() {
  'use strict';

  const TemplateLoader = {
    // API endpoints
    apiBase: 'http://localhost:5001/api/public/templates',
    
    // Current template data
    currentTemplate: null,
    
    // Initialize template loader
    init: async function(overrideType) {
      try {
        // Determine template type based on page
        const templateType = overrideType || this.detectTemplateType();
        
        // Load active template for the determined type
        await this.loadActiveTemplate(templateType);
        
        // Apply template if found
        if (this.currentTemplate) {
          this.applyTemplate();
        }
      } catch (error) {
        console.error('Failed to load template:', error);
      }
    },
    
    // Detect template type based on current page
    detectTemplateType: function() {
      const pathname = window.location.pathname;
      
      if (pathname.includes('content.html') || pathname.includes('article')) {
        return 'content_page';
      } else if (pathname.includes('archive') || pathname.includes('list')) {
        return 'archive_page';
      }
      
      return 'front_page';
    },
    
    // Load active template by type
    loadActiveTemplate: async function(type) {
      try {
        const response = await fetch(`${this.apiBase}/active/${type}`);
        const data = await response.json();
        
        if (data.success && data.template) {
          this.currentTemplate = data.template;
          return true;
        }
        
        return false;
      } catch (error) {
        console.error('Error loading active template:', error);
        return false;
      }
    },
    
    // Apply template to the page
    applyTemplate: function() {
      if (!this.currentTemplate) return;
      
      const config = this.currentTemplate.configuration || {};
      const headerSettings = this.currentTemplate.headerSettings || {};
      const footerSettings = this.currentTemplate.footerSettings || {};
      const layoutSettings = this.currentTemplate.layoutSettings || {};
      
      // Apply site title and subtitle
      if (config.siteTitle) {
        const titleElements = document.querySelectorAll('.site-title, h1.brand');
        titleElements.forEach(el => el.textContent = config.siteTitle);
        document.title = config.siteTitle;
      }
      
      if (config.siteSubtitle) {
        const subtitleElements = document.querySelectorAll('.site-subtitle, .tagline');
        subtitleElements.forEach(el => el.textContent = config.siteSubtitle);
      }
      
      // Apply mission statement
      if (config.showMission && config.missionTitle) {
        const missionTitleEl = document.querySelector('.mission-title, .mission h2');
        if (missionTitleEl) missionTitleEl.textContent = config.missionTitle;
      }
      
      if (config.showMission && config.missionText) {
        const missionTextEl = document.querySelector('.mission-text, .mission p');
        if (missionTextEl) missionTextEl.textContent = config.missionText;
      }
      
      // Show/hide mission section
      const missionSection = document.querySelector('.mission, .mission-statement');
      if (missionSection) {
        missionSection.style.display = config.showMission ? 'block' : 'none';
      }
      
      // Apply colors
      this.applyColors(config);
      
      // Apply typography
      this.applyTypography(config);
      
      // Apply header settings
      this.applyHeaderSettings(headerSettings);
      
      // Apply footer settings
      this.applyFooterSettings(footerSettings);
      
      // Apply layout settings
      this.applyLayoutSettings(layoutSettings);
      
      // Apply spacing
      this.applySpacing(config);
    },
    
    // Apply color settings
    applyColors: function(config) {
      const root = document.documentElement;
      
      if (config.primaryColor) {
        root.style.setProperty('--primary-color', config.primaryColor);
        root.style.setProperty('--link-color', config.primaryColor);
      }
      
      if (config.backgroundColor) {
        root.style.setProperty('--bg-color', config.backgroundColor);
        document.body.style.backgroundColor = config.backgroundColor;
      }
      
      if (config.textColor) {
        root.style.setProperty('--text-color', config.textColor);
        document.body.style.color = config.textColor;
      }
      
      if (config.headerBgColor) {
        const header = document.querySelector('header, .header');
        if (header) header.style.backgroundColor = config.headerBgColor;
      }
      
      if (config.footerBgColor) {
        const footer = document.querySelector('footer, .footer');
        if (footer) footer.style.backgroundColor = config.footerBgColor;
      }
    },
    
    // Apply typography settings
    applyTypography: function(config) {
      const root = document.documentElement;
      
      if (config.fontFamily) {
        root.style.setProperty('--font-family', config.fontFamily);
        document.body.style.fontFamily = config.fontFamily;
      }
      
      if (config.fontSize) {
        root.style.setProperty('--font-size', config.fontSize);
        document.body.style.fontSize = config.fontSize;
      }
      
      if (config.headingFont) {
        const style = document.createElement('style');
        style.textContent = `h1, h2, h3, h4, h5, h6 { font-family: ${config.headingFont} !important; }`;
        document.head.appendChild(style);
      }
    },
    
    // Apply header settings
    applyHeaderSettings: function(settings) {
      const header = document.querySelector('header, .header');
      if (!header) return;
      
      // Header variant
      if (settings.headerVariant) {
        header.className = header.className.replace(/header-\w+/g, '');
        header.classList.add(`header-${settings.headerVariant}`);
      }
      
      // Navigation visibility
      const nav = header.querySelector('nav, .navigation');
      if (nav && settings.showNavigation !== undefined) {
        nav.style.display = settings.showNavigation ? 'block' : 'none';
      }
      
      // Navigation position
      if (nav && settings.navPosition) {
        header.classList.remove('nav-above', 'nav-below', 'nav-inline');
        header.classList.add(`nav-${settings.navPosition}`);
      }
    },
    
    // Apply footer settings
    applyFooterSettings: function(settings) {
      const footer = document.querySelector('footer, .footer');
      if (!footer) return;
      
      // Footer variant
      if (settings.footerVariant) {
        footer.className = footer.className.replace(/footer-\w+/g, '');
        footer.classList.add(`footer-${settings.footerVariant}`);
      }
      
      // Contact info visibility
      const contactInfo = footer.querySelector('.contact-info, .contact');
      if (contactInfo && settings.showContactInfo !== undefined) {
        contactInfo.style.display = settings.showContactInfo ? 'block' : 'none';
      }
      
      // Social links visibility
      const socialLinks = footer.querySelector('.social-links, .social');
      if (socialLinks && settings.showSocialLinks !== undefined) {
        socialLinks.style.display = settings.showSocialLinks ? 'block' : 'none';
      }
    },
    
    // Apply layout settings
    applyLayoutSettings: function(settings) {
      const container = document.querySelector('.container, .main-container, main');
      if (!container) return;
      
      // Content width
      if (settings.contentWidth) {
        const widthMap = {
          'sm': '640px',
          'md': '768px',
          'lg': '1024px',
          'xl': '1280px',
          'full': '100%'
        };
        container.style.maxWidth = widthMap[settings.contentWidth] || settings.contentWidth;
        container.style.margin = '0 auto';
      }
      
      // Sidebar visibility
      const sidebar = document.querySelector('.sidebar, aside');
      if (sidebar && settings.showSidebar !== undefined) {
        sidebar.style.display = settings.showSidebar ? 'block' : 'none';
        
        // Adjust main content width
        const mainContent = document.querySelector('.main-content, .content');
        if (mainContent) {
          mainContent.style.width = settings.showSidebar ? 'calc(100% - 300px)' : '100%';
        }
      }
      
      // Sidebar position
      if (sidebar && settings.sidebarPosition) {
        const wrapper = sidebar.parentElement;
        if (wrapper) {
          wrapper.style.flexDirection = settings.sidebarPosition === 'left' ? 'row-reverse' : 'row';
        }
      }
    },
    
    // Apply spacing settings
    applySpacing: function(config) {
      const root = document.documentElement;
      
      if (config.containerPadding) {
        root.style.setProperty('--container-padding', config.containerPadding);
      }
      
      if (config.sectionSpacing) {
        root.style.setProperty('--section-spacing', config.sectionSpacing);
      }
      
      if (config.elementSpacing) {
        root.style.setProperty('--element-spacing', config.elementSpacing);
      }
    },
    
    // Load template by slug
    loadTemplateBySlug: async function(slug) {
      try {
        const response = await fetch(`${this.apiBase}/${slug}`);
        const data = await response.json();
        
        if (data.success && data.template) {
          this.currentTemplate = data.template;
          this.applyTemplate();
          return true;
        }
        
        return false;
      } catch (error) {
        console.error('Error loading template by slug:', error);
        return false;
      }
    }
  };
  
  // Initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => TemplateLoader.init());
  } else {
    TemplateLoader.init();
  }
  
  // Expose to global scope for debugging
  window.TemplateLoader = TemplateLoader;
})();
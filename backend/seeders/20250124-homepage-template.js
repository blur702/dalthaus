'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const templateData = {
      id: require('crypto').randomUUID(),
      name: 'Homepage - 2/3 Photobooks 1/3 Articles',
      slug: 'homepage-photobooks-articles',
      type: 'front_page',
      description: 'A homepage template featuring a 2/3 column for photobooks and 1/3 column for articles',
      configuration: JSON.stringify({
        layout: {
          type: 'two-column',
          leftColumn: {
            width: '66.66%',
            contentType: 'photobooks',
            title: 'Featured Photo Books',
            itemsPerPage: 6,
            displayStyle: 'grid',
            columns: 2
          },
          rightColumn: {
            width: '33.33%',
            contentType: 'articles',
            title: 'Latest Articles',
            itemsPerPage: 4,
            displayStyle: 'list'
          }
        },
        colors: {
          primary: '#333333',
          secondary: '#666666',
          accent: '#0066cc',
          background: '#ffffff',
          text: '#333333'
        },
        typography: {
          fontFamily: 'Arial, sans-serif',
          headingFont: 'Georgia, serif',
          baseFontSize: '16px'
        },
        featuredImage: {
          display: true,
          aspectRatio: '16:9',
          fallbackImage: '/images/placeholder.jpg'
        }
      }),
      headerSettings: JSON.stringify({
        headerVariant: 'banner',
        showNavigation: true,
        navPosition: 'below',
        showMission: true
      }),
      footerSettings: JSON.stringify({
        footerVariant: 'detailed',
        showContactInfo: true,
        showSocialLinks: true
      }),
      layoutSettings: JSON.stringify({
        contentWidth: 'lg',
        showSidebar: false,
        sidebarPosition: null,
        gutter: '2rem',
        responsiveBreakpoint: '768px'
      }),
      isActive: true,
      isDefault: false,
      version: 1,
      metadata: JSON.stringify({
        author: 'System',
        tags: ['homepage', 'photobooks', 'articles', 'two-column'],
        responsive: true,
        mobileOptimized: true
      }),
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // First, deactivate any existing active front_page templates
    await queryInterface.bulkUpdate(
      'Templates',
      { isActive: false, updatedAt: new Date() },
      {
        type: 'front_page',
        isActive: true
      }
    );

    // Insert the new template
    await queryInterface.bulkInsert('Templates', [templateData]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Templates', {
      slug: 'homepage-photobooks-articles'
    });
  }
};
'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Add globalSettings column to Templates table
    await queryInterface.addColumn('Templates', 'globalSettings', {
      type: Sequelize.JSON,
      allowNull: false,
      defaultValue: {},
      comment: 'Global settings for typography, colors, spacing, etc.'
    });
    
    // Update existing headerSettings default to include new fields
    await queryInterface.changeColumn('Templates', 'headerSettings', {
      type: Sequelize.JSON,
      allowNull: false,
      defaultValue: {
        headerVariant: 'banner',
        showNavigation: true,
        navPosition: 'below',
        showMission: true,
        height: 80,
        width: 100,
        widthUnit: '%',
        sticky: false,
        backgroundColor: '#ffffff',
        backgroundImage: null,
        backgroundOpacity: 100,
        backgroundPosition: 'center',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        padding: { top: 20, bottom: 20, left: 20, right: 20 },
        boxShadow: '0px 2px 4px rgba(0,0,0,0.1)',
        borderBottom: '1px solid #e0e0e0'
      },
      comment: 'Enhanced header-specific settings'
    });
    
    // Update existing footerSettings default to include new fields
    await queryInterface.changeColumn('Templates', 'footerSettings', {
      type: Sequelize.JSON,
      allowNull: false,
      defaultValue: {
        footerVariant: 'detailed',
        showContactInfo: true,
        showSocialLinks: true,
        height: 200,
        width: 100,
        widthUnit: '%',
        backgroundColor: '#2c3e50',
        backgroundImage: null,
        backgroundOpacity: 100,
        backgroundPosition: 'center',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        padding: { top: 40, bottom: 40, left: 20, right: 20 },
        textColor: '#ffffff',
        linkColor: '#3498db',
        layout: 'three-column',
        showNewsletter: false
      },
      comment: 'Enhanced footer-specific settings'
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Remove globalSettings column
    await queryInterface.removeColumn('Templates', 'globalSettings');
    
    // Revert headerSettings to original default
    await queryInterface.changeColumn('Templates', 'headerSettings', {
      type: Sequelize.JSON,
      allowNull: false,
      defaultValue: {
        headerVariant: 'banner',
        showNavigation: true,
        navPosition: 'below',
        showMission: true
      },
      comment: 'Header-specific settings'
    });
    
    // Revert footerSettings to original default
    await queryInterface.changeColumn('Templates', 'footerSettings', {
      type: Sequelize.JSON,
      allowNull: false,
      defaultValue: {
        footerVariant: 'detailed',
        showContactInfo: true,
        showSocialLinks: true
      },
      comment: 'Footer-specific settings'
    });
  }
};
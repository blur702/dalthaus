'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Templates', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      slug: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      type: {
        type: Sequelize.ENUM('front_page', 'content_page', 'archive_page', 'custom'),
        allowNull: false,
        defaultValue: 'front_page'
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      configuration: {
        type: Sequelize.JSON,
        allowNull: false,
        defaultValue: {},
        comment: 'Template configuration including colors, fonts, layout settings, etc.'
      },
      headerSettings: {
        type: Sequelize.JSON,
        allowNull: false,
        defaultValue: {
          headerVariant: 'banner',
          showNavigation: true,
          navPosition: 'below',
          showMission: true
        },
        comment: 'Header-specific settings'
      },
      footerSettings: {
        type: Sequelize.JSON,
        allowNull: false,
        defaultValue: {
          footerVariant: 'detailed',
          showContactInfo: true,
          showSocialLinks: true
        },
        comment: 'Footer-specific settings'
      },
      layoutSettings: {
        type: Sequelize.JSON,
        allowNull: false,
        defaultValue: {
          contentWidth: 'lg',
          showSidebar: true,
          sidebarPosition: 'right'
        },
        comment: 'Layout-specific settings'
      },
      isActive: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        comment: 'Only one template can be active per type'
      },
      isDefault: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        comment: 'System default template that cannot be deleted'
      },
      version: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1,
        comment: 'Template version for tracking changes'
      },
      previewImage: {
        type: Sequelize.STRING,
        allowNull: true,
        comment: 'URL to template preview image'
      },
      metadata: {
        type: Sequelize.JSON,
        allowNull: true,
        defaultValue: {},
        comment: 'Additional metadata like author, tags, etc.'
      },
      createdBy: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'Users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      updatedBy: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'Users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });

    // Add indexes
    await queryInterface.addIndex('Templates', ['type']);
    await queryInterface.addIndex('Templates', ['isActive']);
    await queryInterface.addIndex('Templates', ['slug']);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Templates');
  }
};
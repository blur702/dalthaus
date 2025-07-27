'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('site_settings', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
      },
      site_name: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'My Site'
      },
      site_description: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      favicon_url: {
        type: Sequelize.STRING,
        allowNull: true
      },
      meta_keywords: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      meta_author: {
        type: Sequelize.STRING,
        allowNull: true
      },
      contact_email: {
        type: Sequelize.STRING,
        allowNull: true
      },
      copyright_text: {
        type: Sequelize.STRING,
        allowNull: true
      },
      google_analytics_id: {
        type: Sequelize.STRING,
        allowNull: true
      },
      timezone: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'America/New_York'
      },
      metadata: {
        type: Sequelize.JSON,
        allowNull: true,
        defaultValue: {}
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false
      }
    });

    // Insert default settings
    const { v4: uuidv4 } = require('uuid');
    await queryInterface.bulkInsert('site_settings', [{
      id: uuidv4(),
      site_name: 'My CMS Site',
      site_description: 'A powerful content management system',
      timezone: 'America/New_York',
      created_at: new Date(),
      updated_at: new Date()
    }]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('site_settings');
  }
};
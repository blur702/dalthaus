'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Add summary field to base_content table
    await queryInterface.addColumn('base_content', 'summary', {
      type: Sequelize.TEXT,
      allowNull: true,
      comment: 'Brief summary of the content for listing pages'
    });

    // Add teaserImage field to base_content table
    await queryInterface.addColumn('base_content', 'teaser_image', {
      type: Sequelize.STRING,
      allowNull: true,
      comment: 'Image URL for content listings/teasers'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('base_content', 'summary');
    await queryInterface.removeColumn('base_content', 'teaser_image');
  }
};
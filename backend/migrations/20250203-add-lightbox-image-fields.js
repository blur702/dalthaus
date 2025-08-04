'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Add lightbox image URL field for featured images
    await queryInterface.addColumn('content', 'featured_image_lightbox', {
      type: Sequelize.STRING,
      allowNull: true,
      comment: 'URL to larger version of featured image for lightbox display'
    });

    // Add lightbox image URL field for teaser images
    await queryInterface.addColumn('content', 'teaser_image_lightbox', {
      type: Sequelize.STRING,
      allowNull: true,
      comment: 'URL to larger version of teaser image for lightbox display'
    });

    // Add field to store lightbox URLs for inline images (JSON array)
    await queryInterface.addColumn('content', 'inline_image_lightbox_urls', {
      type: Sequelize.JSON,
      allowNull: true,
      defaultValue: {},
      comment: 'JSON object mapping inline image URLs to their lightbox versions'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('content', 'featured_image_lightbox');
    await queryInterface.removeColumn('content', 'teaser_image_lightbox');
    await queryInterface.removeColumn('content', 'inline_image_lightbox_urls');
  }
};
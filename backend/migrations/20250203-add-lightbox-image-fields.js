'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Add lightbox image URL field for featured images
    await queryInterface.addColumn('BaseContents', 'featuredImageLightbox', {
      type: Sequelize.STRING,
      allowNull: true,
      field: 'featured_image_lightbox',
      comment: 'URL to larger version of featured image for lightbox display'
    });

    // Add lightbox image URL field for teaser images
    await queryInterface.addColumn('BaseContents', 'teaserImageLightbox', {
      type: Sequelize.STRING,
      allowNull: true,
      field: 'teaser_image_lightbox',
      comment: 'URL to larger version of teaser image for lightbox display'
    });

    // Add field to store lightbox URLs for inline images (JSON array)
    await queryInterface.addColumn('BaseContents', 'inlineImageLightboxUrls', {
      type: Sequelize.JSON,
      allowNull: true,
      defaultValue: {},
      field: 'inline_image_lightbox_urls',
      comment: 'JSON object mapping inline image URLs to their lightbox versions'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('BaseContents', 'featuredImageLightbox');
    await queryInterface.removeColumn('BaseContents', 'teaserImageLightbox');
    await queryInterface.removeColumn('BaseContents', 'inlineImageLightboxUrls');
  }
};
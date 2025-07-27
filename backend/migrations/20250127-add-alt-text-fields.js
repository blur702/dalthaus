'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Add alt text fields for featured and teaser images
    await queryInterface.addColumn('content', 'featured_image_alt', {
      type: Sequelize.STRING,
      allowNull: true,
      comment: 'Alt text for featured image accessibility'
    });

    await queryInterface.addColumn('content', 'teaser_image_alt', {
      type: Sequelize.STRING,
      allowNull: true,
      comment: 'Alt text for teaser image accessibility'
    });

    console.log('Added alt text fields to content table');
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('content', 'featured_image_alt');
    await queryInterface.removeColumn('content', 'teaser_image_alt');
  }
};
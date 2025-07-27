'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('content', 'featured_image_caption', {
      type: Sequelize.TEXT,
      allowNull: true,
      comment: 'Caption text for the featured image'
    });

    await queryInterface.addColumn('content', 'featured_image_credit', {
      type: Sequelize.STRING,
      allowNull: true,
      comment: 'Photo credit for the featured image'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('content', 'featured_image_caption');
    await queryInterface.removeColumn('content', 'featured_image_credit');
  }
};
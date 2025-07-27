'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Rename the column from coverImageUrl to featuredImage
    await queryInterface.renameColumn('content', 'coverImageUrl', 'featuredImage');
  },

  down: async (queryInterface, Sequelize) => {
    // Revert the column name back to coverImageUrl
    await queryInterface.renameColumn('content', 'featuredImage', 'coverImageUrl');
  }
};
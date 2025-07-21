'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('content', 'coverImageUrl', {
      type: Sequelize.STRING,
      allowNull: true,
      after: 'body'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('content', 'coverImageUrl');
  }
};
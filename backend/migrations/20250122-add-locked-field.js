'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Add isLocked column
    await queryInterface.addColumn('TinymceSettings', 'isLocked', {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
      allowNull: false,
      comment: 'Prevents profile from being deleted but allows duplication'
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Remove isLocked column
    await queryInterface.removeColumn('TinymceSettings', 'isLocked');
  }
};
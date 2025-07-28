'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Remove templateId and templateOverrides columns if they exist
    const tableInfo = await queryInterface.describeTable('content');
    
    if (tableInfo.templateId) {
      await queryInterface.removeColumn('content', 'templateId');
    }
    
    if (tableInfo.templateOverrides) {
      await queryInterface.removeColumn('content', 'templateOverrides');
    }
  },

  down: async (queryInterface, Sequelize) => {
    // Re-add the columns if needed
    await queryInterface.addColumn('content', 'templateId', {
      type: Sequelize.UUID,
      allowNull: true,
      references: {
        model: 'Templates',
        key: 'id'
      }
    });
    
    await queryInterface.addColumn('content', 'templateOverrides', {
      type: Sequelize.JSONB,
      allowNull: true,
      defaultValue: {}
    });
  }
};
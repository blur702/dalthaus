'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Create ENUM type first (if it doesn't exist)
    await queryInterface.sequelize.query(`
      DO $$ BEGIN
        CREATE TYPE "enum_TinymceSettings_profileType" AS ENUM ('system', 'user', 'content_type', 'custom');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `);

    // Add profileType column
    await queryInterface.addColumn('TinymceSettings', 'profileType', {
      type: Sequelize.ENUM('system', 'user', 'content_type', 'custom'),
      defaultValue: 'custom',
      allowNull: false
    });

    // Add priority column
    await queryInterface.addColumn('TinymceSettings', 'priority', {
      type: Sequelize.INTEGER,
      defaultValue: 0,
      allowNull: false
    });

    // Add conditions column
    await queryInterface.addColumn('TinymceSettings', 'conditions', {
      type: Sequelize.JSONB,
      defaultValue: {},
      allowNull: false
    });

    // Add allowedUsers column
    await queryInterface.addColumn('TinymceSettings', 'allowedUsers', {
      type: Sequelize.ARRAY(Sequelize.UUID),
      defaultValue: [],
      allowNull: false
    });

    // Add allowedRoles column
    await queryInterface.addColumn('TinymceSettings', 'allowedRoles', {
      type: Sequelize.ARRAY(Sequelize.STRING),
      defaultValue: [],
      allowNull: false
    });

    // Add metadata column
    await queryInterface.addColumn('TinymceSettings', 'metadata', {
      type: Sequelize.JSONB,
      defaultValue: {},
      allowNull: false
    });

    // Add indexes for performance
    await queryInterface.addIndex('TinymceSettings', ['profileType'], {
      name: 'idx_tinymce_profiles_type'
    });

    await queryInterface.addIndex('TinymceSettings', ['priority'], {
      name: 'idx_tinymce_profiles_priority'
    });

    // Update existing records to set profileType based on isPreset
    await queryInterface.sequelize.query(`
      UPDATE "TinymceSettings" 
      SET "profileType" = CASE 
        WHEN "isPreset" = true THEN 'system'::enum_TinymceSettings_profileType
        ELSE 'custom'::enum_TinymceSettings_profileType
      END
    `);
  },

  down: async (queryInterface, Sequelize) => {
    // Remove indexes
    await queryInterface.removeIndex('TinymceSettings', 'idx_tinymce_profiles_priority');
    await queryInterface.removeIndex('TinymceSettings', 'idx_tinymce_profiles_type');

    // Remove columns
    await queryInterface.removeColumn('TinymceSettings', 'metadata');
    await queryInterface.removeColumn('TinymceSettings', 'allowedRoles');
    await queryInterface.removeColumn('TinymceSettings', 'allowedUsers');
    await queryInterface.removeColumn('TinymceSettings', 'conditions');
    await queryInterface.removeColumn('TinymceSettings', 'priority');
    await queryInterface.removeColumn('TinymceSettings', 'profileType');

    // Remove the ENUM type
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_TinymceSettings_profileType";');
  }
};
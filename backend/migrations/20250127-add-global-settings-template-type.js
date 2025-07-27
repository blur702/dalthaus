'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // First, we need to drop the existing enum constraint
    await queryInterface.sequelize.query(`
      ALTER TYPE "enum_Templates_type" RENAME TO "enum_Templates_type_old";
    `);

    // Create new enum type with global_settings
    await queryInterface.sequelize.query(`
      CREATE TYPE "enum_Templates_type" AS ENUM('front_page', 'content_page', 'archive_page', 'custom', 'global_settings');
    `);

    // Update the column to use the new enum
    await queryInterface.sequelize.query(`
      ALTER TABLE "Templates" 
      ALTER COLUMN "type" TYPE "enum_Templates_type" 
      USING "type"::text::"enum_Templates_type";
    `);

    // Drop the old enum type
    await queryInterface.sequelize.query(`
      DROP TYPE "enum_Templates_type_old";
    `);
  },

  down: async (queryInterface, Sequelize) => {
    // Delete any global_settings templates first
    await queryInterface.sequelize.query(`
      DELETE FROM "Templates" WHERE "type" = 'global_settings';
    `);

    // Revert back to original enum
    await queryInterface.sequelize.query(`
      ALTER TYPE "enum_Templates_type" RENAME TO "enum_Templates_type_old";
    `);

    await queryInterface.sequelize.query(`
      CREATE TYPE "enum_Templates_type" AS ENUM('front_page', 'content_page', 'archive_page', 'custom');
    `);

    await queryInterface.sequelize.query(`
      ALTER TABLE "Templates" 
      ALTER COLUMN "type" TYPE "enum_Templates_type" 
      USING "type"::text::"enum_Templates_type";
    `);

    await queryInterface.sequelize.query(`
      DROP TYPE "enum_Templates_type_old";
    `);
  }
};
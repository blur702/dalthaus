'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Get the current default settings
    const [settings] = await queryInterface.sequelize.query(
      `SELECT id, settings FROM "GlobalSettings" WHERE key = 'default' LIMIT 1`,
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    if (settings) {
      // Add header background settings to the existing settings JSON
      const currentSettings = typeof settings.settings === 'string' 
        ? JSON.parse(settings.settings) 
        : settings.settings;

      const updatedSettings = {
        ...currentSettings,
        // Header Background Settings
        headerBackgroundImage: null,
        headerBackgroundPosition: 'center center',
        headerBackgroundSize: 'cover',
        headerBackgroundRepeat: 'no-repeat',
        headerBackgroundAttachment: 'scroll',
        headerOverlayColor: 'rgba(0, 0, 0, 0.5)',
        headerOverlayOpacity: 0.5,
        headerHeight: '400px',
        headerContentAlignment: 'center',
        headerBackgroundBlur: 0,
        headerBackgroundBrightness: 100,
        headerBackgroundContrast: 100,
        headerBackgroundGrayscale: 0
      };

      // Update the settings
      await queryInterface.sequelize.query(
        `UPDATE "GlobalSettings" SET settings = :settings, version = version + 1, "updatedAt" = NOW() WHERE id = :id`,
        {
          replacements: {
            settings: JSON.stringify(updatedSettings),
            id: settings.id
          },
          type: queryInterface.sequelize.QueryTypes.UPDATE
        }
      );
    }
  },

  down: async (queryInterface, Sequelize) => {
    // Get the current settings
    const [settings] = await queryInterface.sequelize.query(
      `SELECT id, settings FROM "GlobalSettings" WHERE key = 'default' LIMIT 1`,
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    if (settings) {
      // Remove header background settings
      const currentSettings = typeof settings.settings === 'string' 
        ? JSON.parse(settings.settings) 
        : settings.settings;

      // Remove the header-related keys
      delete currentSettings.headerBackgroundImage;
      delete currentSettings.headerBackgroundPosition;
      delete currentSettings.headerBackgroundSize;
      delete currentSettings.headerBackgroundRepeat;
      delete currentSettings.headerBackgroundAttachment;
      delete currentSettings.headerOverlayColor;
      delete currentSettings.headerOverlayOpacity;
      delete currentSettings.headerHeight;
      delete currentSettings.headerContentAlignment;
      delete currentSettings.headerBackgroundBlur;
      delete currentSettings.headerBackgroundBrightness;
      delete currentSettings.headerBackgroundContrast;
      delete currentSettings.headerBackgroundGrayscale;

      // Update the settings
      await queryInterface.sequelize.query(
        `UPDATE "GlobalSettings" SET settings = :settings, version = version + 1, "updatedAt" = NOW() WHERE id = :id`,
        {
          replacements: {
            settings: JSON.stringify(currentSettings),
            id: settings.id
          },
          type: queryInterface.sequelize.QueryTypes.UPDATE
        }
      );
    }
  }
};
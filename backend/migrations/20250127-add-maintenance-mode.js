'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Add maintenance mode fields to site_settings table
    await queryInterface.addColumn('site_settings', 'maintenance_mode', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      comment: 'Enable/disable maintenance mode for the site'
    });

    await queryInterface.addColumn('site_settings', 'maintenance_message', {
      type: Sequelize.TEXT,
      allowNull: true,
      defaultValue: 'The site is currently under maintenance. Please check back later.',
      comment: 'Message to display when site is in maintenance mode'
    });

    await queryInterface.addColumn('site_settings', 'maintenance_bypass_ips', {
      type: Sequelize.JSON,
      allowNull: true,
      defaultValue: [],
      comment: 'List of IP addresses that can bypass maintenance mode'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('site_settings', 'maintenance_mode');
    await queryInterface.removeColumn('site_settings', 'maintenance_message');
    await queryInterface.removeColumn('site_settings', 'maintenance_bypass_ips');
  }
};
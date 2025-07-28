const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const SiteSettings = sequelize.define('SiteSettings', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    siteName: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'My Site'
    },
    siteDescription: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    faviconUrl: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isUrl: {
          msg: 'Please provide a valid URL for the favicon'
        }
      }
    },
    metaKeywords: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    metaAuthor: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: 'Don Althaus'
    },
    contactEmail: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isEmail: {
          msg: 'Please provide a valid email address'
        }
      }
    },
    copyrightText: {
      type: DataTypes.STRING,
      allowNull: true
    },
    googleAnalyticsId: {
      type: DataTypes.STRING,
      allowNull: true
    },
    timezone: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'America/New_York'
    },
    // Maintenance mode settings
    maintenanceMode: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      field: 'maintenance_mode'
    },
    maintenanceMessage: {
      type: DataTypes.TEXT,
      allowNull: true,
      defaultValue: `Well, what started as a little hiccup has turned (mostly joyfully) into a full-blown evolution -- it's amazing how these things develop organically. This is not just a change, it is a complete systemic evolution -- but it's one of those processes that has to be worked through and doing so will simply take time. We WILL be back with a new website that will have some thought provoking content regarding both the state of photography and where it should be going (at least in our opinion). There is no projected launch at this point but we'll keep you updated.

Update 06/18/2025-- We realize that because this page is still here it doesn't look like it, but progress is being made. We are in the process of using a different under-the-hood system and are about halfway there... this is a system that is both well proven for diverse web-app development and offers enhanced security.
So please, be patient with us... we will be back.

Progress is here!
Update 07/12/2025 -- Okay, this page is still here but we are making progress. The new under-the-hood stuff is very promising and we are starting all of the early testing processes. It looks really good so far and, based on that, we are projecting a launch date sometime in early August.

Again, thanks for your patience!`,
      field: 'maintenance_message'
    },
    maintenanceBypassIps: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: [],
      field: 'maintenance_bypass_ips'
    },
    // Additional metadata that might be needed
    metadata: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: {}
    }
  }, {
    tableName: 'site_settings',
    timestamps: true,
    underscored: true
  });

  return SiteSettings;
};
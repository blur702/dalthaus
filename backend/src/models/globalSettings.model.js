const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const GlobalSettings = sequelize.define('GlobalSettings', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  key: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    defaultValue: 'default',
    comment: 'Settings key, default is "default" for main settings'
  },
  settings: {
    type: DataTypes.JSON,
    allowNull: false,
    defaultValue: {
      // Typography
      primaryFont: 'Roboto',
      secondaryFont: 'Open Sans',
      baseFontSize: 16,
      fontScale: 1.25,
      headingWeight: 700,
      bodyWeight: 400,
      lineHeight: 1.6,
      letterSpacing: 0,
      paragraphSpacing: 1,
      
      // Colors
      primaryColor: '#1976d2',
      secondaryColor: '#dc004e',
      textColor: '#333333',
      backgroundColor: '#ffffff',
      surfaceColor: '#f5f5f5',
      errorColor: '#f44336',
      warningColor: '#ff9800',
      infoColor: '#2196f3',
      successColor: '#4caf50',
      
      // Body Settings
      bodyBackgroundColor: '#ffffff',
      bodyTextColor: '#333333',
      bodyLinkColor: '#1976d2',
      bodyLinkHoverColor: '#115293',
      
      // Heading Styles
      h1: { size: 2.5, weight: 700, lineHeight: 1.2, letterSpacing: -0.02, color: null },
      h2: { size: 2, weight: 700, lineHeight: 1.3, letterSpacing: -0.01, color: null },
      h3: { size: 1.75, weight: 600, lineHeight: 1.4, letterSpacing: 0, color: null },
      h4: { size: 1.5, weight: 600, lineHeight: 1.4, letterSpacing: 0, color: null },
      h5: { size: 1.25, weight: 500, lineHeight: 1.5, letterSpacing: 0, color: null },
      h6: { size: 1, weight: 500, lineHeight: 1.5, letterSpacing: 0, color: null },
      
      // Spacing
      containerMaxWidth: 1200,
      containerPadding: 24,
      sectionSpacing: 80,
      elementSpacing: 24,
      componentSpacing: 16,
      
      // Border & Effects
      borderRadius: 4,
      borderColor: '#e0e0e0',
      borderWidth: 1,
      boxShadow: '0px 2px 4px rgba(0,0,0,0.1)',
      
      // Responsive Breakpoints
      breakpoints: {
        xs: 0,
        sm: 600,
        md: 960,
        lg: 1280,
        xl: 1920
      },
      
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
    },
    comment: 'Global settings configuration'
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Description of this settings configuration'
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
    comment: 'Whether these settings are currently active'
  },
  version: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
    comment: 'Settings version for tracking changes'
  },
  lastModifiedBy: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'Users',
      key: 'id'
    }
  }
}, {
  timestamps: true,
  hooks: {
    beforeUpdate: async (settings) => {
      // Increment version on update
      settings.version = (settings.version || 0) + 1;
    }
  }
});

// Static methods
GlobalSettings.getDefault = async function() {
  let settings = await this.findOne({
    where: { key: 'default', isActive: true }
  });
  
  if (!settings) {
    // Create default settings if none exist
    settings = await this.create({
      key: 'default',
      description: 'Default global settings',
      isActive: true
    });
  }
  
  return settings;
};

GlobalSettings.updateDefault = async function(newSettings, userId = null) {
  const settings = await this.getDefault();
  
  await settings.update({
    settings: { ...settings.settings, ...newSettings },
    lastModifiedBy: userId
  });
  
  return settings;
};

GlobalSettings.resetToDefaults = async function(userId = null) {
  const settings = await this.getDefault();
  
  // Get the default values from the model definition
  const defaultSettings = this.rawAttributes.settings.defaultValue;
  
  await settings.update({
    settings: defaultSettings,
    lastModifiedBy: userId,
    version: 1
  });
  
  return settings;
};

// Instance methods
GlobalSettings.prototype.toJSON = function() {
  const values = { ...this.get() };
  
  // Ensure settings is always an object
  if (typeof values.settings === 'string') {
    try {
      values.settings = JSON.parse(values.settings);
    } catch (e) {
      values.settings = {};
    }
  }
  
  return values;
};

// Model associations
GlobalSettings.associate = (models) => {
  GlobalSettings.belongsTo(models.User, {
    foreignKey: 'lastModifiedBy',
    as: 'lastModifier'
  });
};

module.exports = GlobalSettings;
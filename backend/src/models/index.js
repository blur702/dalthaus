const sequelize = require('../config/database');
const User = require('./user.model');
const TinymceSettings = require('./tinymceSettings.model');
const TinymceToolbarPresets = require('./tinymceToolbarPresets.model');
const TinymceAllowedTags = require('./tinymceAllowedTags.model');
const TinymceFeatureFlags = require('./tinymceFeatureFlags.model');
const SiteSettings = require('./siteSettings.model')(sequelize);
const Template = require('./templates.model');
const GlobalSettings = require('./globalSettings.model');

// Import content models
const { Article, Page, PhotoBook } = require('./content');

// Define associations
const models = {
  User,
  TinymceSettings,
  TinymceToolbarPresets,
  TinymceAllowedTags,
  TinymceFeatureFlags,
  SiteSettings,
  Template,
  GlobalSettings,
  Article,
  Page,
  PhotoBook
};

// TinymceSettings associations
TinymceSettings.hasMany(TinymceAllowedTags, {
  foreignKey: 'profile_id',
  as: 'allowedTags',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
});

TinymceSettings.hasMany(TinymceFeatureFlags, {
  foreignKey: 'profile_id',
  as: 'features',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
});

TinymceSettings.belongsTo(User, {
  foreignKey: 'createdBy',
  as: 'creator'
});

TinymceSettings.belongsTo(User, {
  foreignKey: 'updatedBy',
  as: 'updater'
});

// TinymceAllowedTags associations
TinymceAllowedTags.belongsTo(TinymceSettings, {
  foreignKey: 'profile_id',
  as: 'profile'
});

// TinymceFeatureFlags associations
TinymceFeatureFlags.belongsTo(TinymceSettings, {
  foreignKey: 'profile_id',
  as: 'profile'
});

// User associations with TinyMCE settings
User.hasMany(TinymceSettings, {
  foreignKey: 'createdBy',
  as: 'createdSettings'
});

User.hasMany(TinymceSettings, {
  foreignKey: 'updatedBy',
  as: 'updatedSettings'
});

// Template associations
if (Template.associate) {
  Template.associate(models);
}

// GlobalSettings associations
if (GlobalSettings.associate) {
  GlobalSettings.associate(models);
}

// User associations with Template
User.hasMany(Template, {
  foreignKey: 'createdBy',
  as: 'createdTemplates'
});

User.hasMany(Template, {
  foreignKey: 'updatedBy',
  as: 'updatedTemplates'
});

// Function to sync all models
const syncModels = async (options = {}) => {
  try {
    // Sync in order to respect foreign key constraints
    await User.sync(options);
    await SiteSettings.sync(options);
    await TinymceSettings.sync(options);
    await TinymceToolbarPresets.sync(options);
    await TinymceAllowedTags.sync(options);
    await TinymceFeatureFlags.sync(options);
    await Template.sync(options);
    
    console.log('All models synchronized successfully');
  } catch (error) {
    console.error('Error synchronizing models:', error);
    throw error;
  }
};

// Export models and utilities
module.exports = {
  sequelize,
  ...models,
  syncModels
};
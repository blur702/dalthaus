const sequelize = require('../config/database');
const { DataTypes } = require('sequelize');

// Import all models
const User = require('../models/user.model');
const TinymceSettings = require('../models/tinymceSettings.model');
const Template = require('../models/templates.model');
const GlobalSettings = require('../models/globalSettings.model');

// Import content models
const { Article, Page, PhotoBook } = require('../models/content');

// Import TinyMCE models
const TinymceToolbarPresets = require('../models/tinymceToolbarPresets.model');
const TinymceAllowedTags = require('../models/tinymceAllowedTags.model');
const TinymceFeatureFlags = require('../models/tinymceFeatureFlags.model');

// Export models
const models = {
  User,
  TinymceSettings,
  Template,
  GlobalSettings,
  Article,
  Page,
  PhotoBook,
  TinymceToolbarPresets,
  TinymceAllowedTags,
  TinymceFeatureFlags
};

module.exports = {
  sequelize,
  models
};
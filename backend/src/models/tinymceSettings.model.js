const { DataTypes, Op } = require('sequelize');
const sequelize = require('../config/database');

const TinymceSettings = sequelize.define('TinymceSettings', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: true,
      len: [1, 100]
    }
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  settings: {
    type: DataTypes.JSONB,
    allowNull: false,
    defaultValue: {},
    validate: {
      isValidConfig(value) {
        if (!value || typeof value !== 'object') {
          throw new Error('Settings must be a valid object');
        }
        
        // Ensure pagebreak plugin is always included
        if (value.plugins && Array.isArray(value.plugins)) {
          if (!value.plugins.includes('pagebreak')) {
            throw new Error('Pagebreak plugin must always be included');
          }
        }
      }
    }
  },
  isDefault: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  isPreset: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  isLocked: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    comment: 'Prevents profile from being deleted but allows duplication'
  },
  tags: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: []
  },
  // New fields
  profileType: {
    type: DataTypes.ENUM('system', 'user', 'content_type', 'custom'),
    defaultValue: 'custom',
    allowNull: false
  },
  priority: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    allowNull: false,
    comment: 'Higher priority profiles override lower ones'
  },
  conditions: {
    type: DataTypes.JSONB,
    defaultValue: {},
    allowNull: false,
    validate: {
      isValidConditions(value) {
        if (value && typeof value !== 'object') {
          throw new Error('Conditions must be a valid object');
        }
      }
    }
  },
  allowedUsers: {
    type: DataTypes.ARRAY(DataTypes.UUID),
    defaultValue: [],
    allowNull: false
  },
  allowedRoles: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: [],
    allowNull: false
  },
  metadata: {
    type: DataTypes.JSONB,
    defaultValue: {},
    allowNull: false
  },
  createdBy: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  updatedBy: {
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
    beforeCreate: async (settings) => {
      // Ensure only one default
      if (settings.isDefault) {
        await TinymceSettings.update({ isDefault: false }, { where: { isDefault: true } });
      }
      
      // Always include pagebreak in plugins
      if (settings.settings && settings.settings.plugins) {
        if (!settings.settings.plugins.includes('pagebreak')) {
          settings.settings.plugins.push('pagebreak');
        }
      }
      
      // Set initial metadata
      settings.metadata = {
        ...settings.metadata,
        version: '1.0.0',
        usage_count: 0,
        performance_score: 100
      };
    },
    beforeUpdate: async (settings) => {
      // Ensure only one default
      if (settings.isDefault) {
        await TinymceSettings.update({ isDefault: false }, { 
          where: { isDefault: true, id: { [Op.ne]: settings.id } } 
        });
      }
      
      // Always include pagebreak in plugins
      if (settings.settings && settings.settings.plugins) {
        if (!settings.settings.plugins.includes('pagebreak')) {
          settings.settings.plugins.push('pagebreak');
        }
      }
      
      // Update metadata timestamp
      if (settings.changed()) {
        settings.metadata = {
          ...settings.metadata,
          lastModified: new Date().toISOString()
        };
      }
    },
    afterCreate: async (settings) => {
      // Initialize default feature flags for new profile
      const TinymceFeatureFlags = require('./tinymceFeatureFlags.model');
      await TinymceFeatureFlags.initializeFeaturesForProfile(settings.id);
    }
  }
});

// Define associations
TinymceSettings.associate = function(models) {
  // Has many allowed tags
  TinymceSettings.hasMany(models.TinymceAllowedTags, {
    foreignKey: 'profile_id',
    as: 'allowedTags',
    onDelete: 'CASCADE'
  });
  
  // Has many feature flags
  TinymceSettings.hasMany(models.TinymceFeatureFlags, {
    foreignKey: 'profile_id',
    as: 'features',
    onDelete: 'CASCADE'
  });
  
  // Belongs to User (creator)
  TinymceSettings.belongsTo(models.User, {
    foreignKey: 'createdBy',
    as: 'creator'
  });
  
  // Belongs to User (updater)
  TinymceSettings.belongsTo(models.User, {
    foreignKey: 'updatedBy',
    as: 'updater'
  });
};

// Class methods
TinymceSettings.getByProfileType = async function(type) {
  return await this.findAll({
    where: { profileType: type },
    order: [['priority', 'DESC'], ['createdAt', 'DESC']]
  });
};

TinymceSettings.getEffectiveProfile = async function(context = {}) {
  const { contentType, userId, userRole } = context;
  
  // Build query conditions
  const conditions = {
    [Op.or]: [
      // Global profiles
      { profileType: 'system' },
      // Content type specific
      ...(contentType ? [{
        profileType: 'content_type',
        conditions: {
          contentTypes: {
            [Op.contains]: [contentType]
          }
        }
      }] : []),
      // User specific
      ...(userId ? [{
        allowedUsers: {
          [Op.contains]: [userId]
        }
      }] : []),
      // Role specific
      ...(userRole ? [{
        allowedRoles: {
          [Op.contains]: [userRole]
        }
      }] : [])
    ]
  };
  
  const profiles = await this.findAll({
    where: conditions,
    order: [['priority', 'DESC'], ['profileType', 'DESC'], ['createdAt', 'DESC']],
    include: [
      { model: require('./tinymceAllowedTags.model'), as: 'allowedTags' },
      { model: require('./tinymceFeatureFlags.model'), as: 'features' }
    ]
  });
  
  // Return the highest priority matching profile
  return profiles[0] || await this.findOne({ where: { isDefault: true } });
};

TinymceSettings.compileConfiguration = async function(profileId) {
  const profile = await this.findByPk(profileId, {
    include: [
      { model: require('./tinymceAllowedTags.model'), as: 'allowedTags' },
      { model: require('./tinymceFeatureFlags.model'), as: 'features' }
    ]
  });
  
  if (!profile) {
    throw new Error('Profile not found');
  }
  
  // Start with base settings
  let config = { ...profile.settings };
  
  // Add valid_elements from allowed tags
  if (profile.allowedTags && profile.allowedTags.length > 0) {
    const validElements = profile.allowedTags
      .map(tag => tag.generateValidElementString())
      .join(',');
    config.valid_elements = validElements;
  }
  
  // Apply feature flags
  if (profile.features) {
    profile.features.forEach(feature => {
      if (feature.enabled) {
        const featureConfig = feature.toTinyMCEConfig();
        if (featureConfig) {
          config = { ...config, ...featureConfig };
        }
      }
    });
  }
  
  // Always ensure pagebreak is included
  if (!config.plugins || !config.plugins.includes('pagebreak')) {
    config.plugins = [...(config.plugins || []), 'pagebreak'];
  }
  
  return config;
};

// Instance methods
TinymceSettings.prototype.canBeAccessedBy = function(user) {
  // System profiles are accessible to all
  if (this.profileType === 'system') {
    return true;
  }
  
  // Check ownership
  if (this.createdBy === user.id) {
    return true;
  }
  
  // Check allowed users
  if (this.allowedUsers.includes(user.id)) {
    return true;
  }
  
  // Check allowed roles
  if (this.allowedRoles.includes(user.role)) {
    return true;
  }
  
  return false;
};

TinymceSettings.prototype.incrementUsageCount = async function() {
  this.metadata = {
    ...this.metadata,
    usage_count: (this.metadata.usage_count || 0) + 1,
    last_used: new Date().toISOString()
  };
  
  return await this.save();
};

TinymceSettings.prototype.duplicate = async function(newName, userId) {
  const TinymceAllowedTags = require('./tinymceAllowedTags.model');
  const TinymceFeatureFlags = require('./tinymceFeatureFlags.model');
  
  // Create new profile
  const newProfile = await TinymceSettings.create({
    name: newName,
    description: this.description + ' (Copy)',
    settings: this.settings,
    isDefault: false,
    isPreset: false,
    tags: this.tags,
    profileType: 'custom',
    priority: this.priority,
    conditions: this.conditions,
    allowedUsers: [],
    allowedRoles: [],
    metadata: {
      version: '1.0.0',
      usage_count: 0,
      cloned_from: this.id
    },
    createdBy: userId,
    updatedBy: userId
  });
  
  // Copy allowed tags
  const allowedTags = await TinymceAllowedTags.getTagsForProfile(this.id);
  if (allowedTags.length > 0) {
    await TinymceAllowedTags.bulkCreateForProfile(
      newProfile.id,
      allowedTags.map(tag => ({
        tag_name: tag.tag_name,
        attributes: tag.attributes,
        is_void: tag.is_void
      }))
    );
  }
  
  // Update the automatically created feature flags with the source profile's settings
  const sourceFeatures = await TinymceFeatureFlags.getFeaturesForProfile(this.id);
  for (const sourceFeature of sourceFeatures) {
    // Find the corresponding feature in the new profile
    const targetFeature = await TinymceFeatureFlags.findOne({
      where: {
        profile_id: newProfile.id,
        feature_name: sourceFeature.feature_name
      }
    });
    
    if (targetFeature) {
      // Update with source settings
      targetFeature.enabled = sourceFeature.enabled;
      targetFeature.config = sourceFeature.config;
      await targetFeature.save();
    }
  }
  
  return newProfile;
};

module.exports = TinymceSettings;
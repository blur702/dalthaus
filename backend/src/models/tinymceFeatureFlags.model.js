const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const TinymceFeatureFlags = sequelize.define('TinymceFeatureFlags', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  profile_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'TinymceSettings',
      key: 'id'
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  },
  feature_name: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Feature name is required'
      },
      isIn: {
        args: [[
          'pagebreak', 'spellcheck', 'autosave', 'wordcount', 'accessibility',
          'templates', 'quickbars', 'powerpaste', 'linkchecker', 'imagetools',
          'mentions', 'mediaembed', 'formatpainter', 'permanentpen', 'toc',
          'emoticons', 'checklist', 'casechange', 'export', 'pageembed'
        ]],
        msg: 'Invalid feature name'
      }
    }
  },
  enabled: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    allowNull: false,
    validate: {
      pagebreakMustBeEnabled(value) {
        if (this.feature_name === 'pagebreak' && value === false) {
          throw new Error('Pagebreak feature must always be enabled');
        }
      }
    }
  },
  config: {
    type: DataTypes.JSONB,
    defaultValue: {},
    allowNull: false,
    validate: {
      isValidConfig(value) {
        if (value && typeof value !== 'object') {
          throw new Error('Feature config must be a valid object');
        }
      }
    }
  }
}, {
  timestamps: false,
  tableName: 'TinymceFeatureFlags',
  indexes: [
    {
      unique: true,
      fields: ['profile_id', 'feature_name'],
      name: 'unique_profile_feature'
    }
  ],
  hooks: {
    beforeValidate: (featureFlag) => {
      // Ensure pagebreak is always enabled
      if (featureFlag.feature_name === 'pagebreak' && featureFlag.enabled === false) {
        throw new Error('Pagebreak feature must always be enabled');
      }
    },
    beforeUpdate: (featureFlag) => {
      // Double-check pagebreak cannot be disabled
      if (featureFlag.feature_name === 'pagebreak' && featureFlag.enabled === false) {
        throw new Error('Pagebreak feature must always be enabled');
      }
    }
  }
});

// Feature definitions with default configs
TinymceFeatureFlags.FEATURES = {
  pagebreak: {
    name: 'Page Break',
    description: 'Insert page break markers for content pagination',
    alwaysEnabled: true,
    defaultConfig: {
      separator: '<!-- pagebreak -->',
      split_block: true
    }
  },
  spellcheck: {
    name: 'Spell Check',
    description: 'Enable spell checking functionality',
    defaultConfig: {
      language: 'en_US',
      spellchecker_languages: 'English=en,Spanish=es,French=fr,German=de'
    }
  },
  autosave: {
    name: 'Auto Save',
    description: 'Automatically save content at intervals',
    defaultConfig: {
      interval: 30,
      retention: '20m',
      restore_when_empty: false
    }
  },
  wordcount: {
    name: 'Word Count',
    description: 'Display word and character count',
    defaultConfig: {
      countSpaces: false,
      countHTML: false
    }
  },
  accessibility: {
    name: 'Accessibility',
    description: 'Accessibility checker and helpers',
    defaultConfig: {
      level: 'AA',
      alt_text_warning: true
    }
  },
  templates: {
    name: 'Templates',
    description: 'Pre-defined content templates',
    defaultConfig: {}
  },
  quickbars: {
    name: 'Quick Toolbars',
    description: 'Context-sensitive inline toolbars',
    defaultConfig: {
      quickbars_selection_toolbar: 'bold italic | quicklink h2 h3 blockquote',
      quickbars_insert_toolbar: 'quickimage quicktable'
    }
  }
};

// Class methods
TinymceFeatureFlags.getFeaturesForProfile = async function(profileId) {
  return await this.findAll({
    where: { profile_id: profileId },
    order: [['feature_name', 'ASC']]
  });
};

TinymceFeatureFlags.getEnabledFeaturesForProfile = async function(profileId) {
  return await this.findAll({
    where: { 
      profile_id: profileId,
      enabled: true
    },
    order: [['feature_name', 'ASC']]
  });
};

TinymceFeatureFlags.initializeFeaturesForProfile = async function(profileId) {
  const { v4: uuidv4 } = require('uuid');
  const features = [];
  
  Object.entries(this.FEATURES).forEach(([featureName, featureInfo]) => {
    features.push({
      id: uuidv4(), // Generate unique ID for each feature flag
      profile_id: profileId,
      feature_name: featureName,
      enabled: featureName === 'pagebreak' ? true : true, // Most features enabled by default
      config: featureInfo.defaultConfig || {}
    });
  });
  
  return await this.bulkCreate(features, {
    validate: true,
    updateOnDuplicate: ['enabled', 'config']
  });
};

TinymceFeatureFlags.toggleFeature = async function(profileId, featureName, enabled) {
  if (featureName === 'pagebreak' && !enabled) {
    throw new Error('Pagebreak feature cannot be disabled');
  }
  
  const [feature, created] = await this.findOrCreate({
    where: {
      profile_id: profileId,
      feature_name: featureName
    },
    defaults: {
      enabled: enabled,
      config: this.FEATURES[featureName]?.defaultConfig || {}
    }
  });
  
  if (!created && feature.enabled !== enabled) {
    feature.enabled = enabled;
    await feature.save();
  }
  
  return feature;
};

// Instance methods
TinymceFeatureFlags.prototype.getPluginName = function() {
  // Map feature names to TinyMCE plugin names
  const pluginMap = {
    pagebreak: 'pagebreak',
    spellcheck: 'spellchecker',
    autosave: 'autosave',
    wordcount: 'wordcount',
    templates: 'template',
    quickbars: 'quickbars',
    emoticons: 'emoticons'
  };
  
  return pluginMap[this.feature_name] || this.feature_name;
};

TinymceFeatureFlags.prototype.mergeConfig = function(newConfig) {
  this.config = {
    ...this.config,
    ...newConfig
  };
  
  return this.save();
};

TinymceFeatureFlags.prototype.toTinyMCEConfig = function() {
  if (!this.enabled) {
    return null;
  }
  
  const config = { ...this.config };
  
  // Special handling for certain features
  switch (this.feature_name) {
    case 'pagebreak':
      return {
        pagebreak_separator: config.separator,
        pagebreak_split_block: config.split_block
      };
    case 'autosave':
      return {
        autosave_interval: config.interval + 's',
        autosave_retention: config.retention,
        autosave_restore_when_empty: config.restore_when_empty
      };
    case 'wordcount':
      return {
        wordcount_countspaces: config.countSpaces,
        wordcount_counthtml: config.countHTML
      };
    default:
      return config;
  }
};

module.exports = TinymceFeatureFlags;
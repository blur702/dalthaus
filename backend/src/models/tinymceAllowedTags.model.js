const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const TinymceAllowedTags = sequelize.define('TinymceAllowedTags', {
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
  tag_name: {
    type: DataTypes.STRING(50),
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Tag name is required'
      },
      is: {
        args: /^[a-zA-Z][a-zA-Z0-9]*$/,
        msg: 'Tag name must start with a letter and contain only letters and numbers'
      },
      isLowercase: {
        msg: 'Tag name must be lowercase'
      }
    },
    set(value) {
      this.setDataValue('tag_name', value ? value.toLowerCase() : value);
    }
  },
  attributes: {
    type: DataTypes.JSONB,
    defaultValue: {},
    allowNull: false,
    validate: {
      isValidAttributeConfig(value) {
        if (!value || typeof value !== 'object') {
          throw new Error('Attributes must be a valid object');
        }
        
        // Validate each attribute configuration
        Object.entries(value).forEach(([attrName, attrConfig]) => {
          if (!attrConfig.type) {
            throw new Error(`Attribute ${attrName} must have a type`);
          }
          
          const validTypes = ['string', 'number', 'boolean', 'url', 'email'];
          if (!validTypes.includes(attrConfig.type)) {
            throw new Error(`Attribute ${attrName} has invalid type: ${attrConfig.type}`);
          }
          
          if (attrConfig.enum && !Array.isArray(attrConfig.enum)) {
            throw new Error(`Attribute ${attrName} enum must be an array`);
          }
        });
      }
    }
  },
  is_void: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: false,
    comment: 'Whether this is a void element (self-closing)'
  }
}, {
  timestamps: false,
  tableName: 'TinymceAllowedTags',
  indexes: [
    {
      unique: true,
      fields: ['profile_id', 'tag_name'],
      name: 'unique_profile_tag'
    }
  ]
});

// Static list of void elements in HTML
TinymceAllowedTags.VOID_ELEMENTS = [
  'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input',
  'link', 'meta', 'param', 'source', 'track', 'wbr'
];

// Static list of dangerous tags that should be restricted
TinymceAllowedTags.DANGEROUS_TAGS = [
  'script', 'style', 'iframe', 'object', 'embed', 'form',
  'input', 'button', 'select', 'textarea', 'link', 'meta'
];

// Common attribute configurations
TinymceAllowedTags.COMMON_ATTRIBUTES = {
  class: { type: 'string' },
  id: { type: 'string' },
  style: { type: 'string' },
  title: { type: 'string' },
  'data-*': { type: 'string', pattern: 'data-.*' }
};

// Class methods
TinymceAllowedTags.getTagsForProfile = async function(profileId) {
  return await this.findAll({
    where: { profile_id: profileId },
    order: [['tag_name', 'ASC']]
  });
};

TinymceAllowedTags.bulkCreateForProfile = async function(profileId, tags) {
  // First, delete existing tags for the profile
  await this.destroy({ where: { profile_id: profileId } });
  
  // Prepare tags for bulk insert
  const tagsToInsert = tags.map(tag => ({
    profile_id: profileId,
    tag_name: tag.tag_name || tag.name,
    attributes: tag.attributes || {},
    is_void: tag.is_void || this.VOID_ELEMENTS.includes(tag.tag_name || tag.name)
  }));
  
  return await this.bulkCreate(tagsToInsert, {
    validate: true,
    returning: true
  });
};

// Instance methods
TinymceAllowedTags.prototype.generateValidElementString = function() {
  let elementStr = this.tag_name;
  const attrs = Object.keys(this.attributes);
  
  if (attrs.length > 0) {
    elementStr += '[' + attrs.join('|') + ']';
  }
  
  return elementStr;
};

TinymceAllowedTags.prototype.validateAttribute = function(attrName, attrValue) {
  const attrConfig = this.attributes[attrName];
  
  if (!attrConfig) {
    // Check for wildcard attributes like data-*
    const wildcardAttr = Object.keys(this.attributes).find(attr => {
      if (attr.includes('*')) {
        const pattern = new RegExp('^' + attr.replace('*', '.*') + '$');
        return pattern.test(attrName);
      }
      return false;
    });
    
    if (!wildcardAttr) {
      return false;
    }
  }
  
  // Additional validation based on type
  if (attrConfig) {
    if (attrConfig.required && !attrValue) {
      return false;
    }
    
    if (attrConfig.enum && !attrConfig.enum.includes(attrValue)) {
      return false;
    }
    
    if (attrConfig.pattern) {
      const pattern = new RegExp(attrConfig.pattern);
      if (!pattern.test(attrValue)) {
        return false;
      }
    }
  }
  
  return true;
};

// Hooks
TinymceAllowedTags.beforeCreate = async (tag) => {
  // Auto-detect void elements
  if (TinymceAllowedTags.VOID_ELEMENTS.includes(tag.tag_name)) {
    tag.is_void = true;
  }
};

TinymceAllowedTags.beforeBulkCreate = async (tags) => {
  tags.forEach(tag => {
    if (TinymceAllowedTags.VOID_ELEMENTS.includes(tag.tag_name)) {
      tag.is_void = true;
    }
  });
};

module.exports = TinymceAllowedTags;
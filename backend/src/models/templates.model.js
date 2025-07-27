const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Template = sequelize.define('Template', {
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
      len: [3, 100]
    }
  },
  slug: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: true,
      is: /^[a-z0-9-]+$/i
    }
  },
  type: {
    type: DataTypes.ENUM('front_page', 'content_page', 'archive_page', 'custom', 'global_settings'),
    allowNull: false,
    defaultValue: 'front_page'
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  configuration: {
    type: DataTypes.JSON,
    allowNull: false,
    defaultValue: {},
    comment: 'Template configuration including colors, fonts, layout settings, etc.'
  },
  headerSettings: {
    type: DataTypes.JSON,
    allowNull: false,
    defaultValue: {
      headerVariant: 'banner',
      showNavigation: true,
      navPosition: 'below',
      showMission: true,
      height: 80,
      width: 100,
      widthUnit: '%',
      sticky: false,
      backgroundColor: '#ffffff',
      backgroundImage: null,
      backgroundOpacity: 100,
      backgroundPosition: 'center',
      backgroundSize: 'cover',
      backgroundRepeat: 'no-repeat',
      padding: { top: 20, bottom: 20, left: 20, right: 20 },
      boxShadow: '0px 2px 4px rgba(0,0,0,0.1)',
      borderBottom: '1px solid #e0e0e0'
    },
    comment: 'Enhanced header-specific settings'
  },
  footerSettings: {
    type: DataTypes.JSON,
    allowNull: false,
    defaultValue: {
      footerVariant: 'detailed',
      showContactInfo: true,
      showSocialLinks: true,
      height: 200,
      width: 100,
      widthUnit: '%',
      backgroundColor: '#2c3e50',
      backgroundImage: null,
      backgroundOpacity: 100,
      backgroundPosition: 'center',
      backgroundSize: 'cover',
      backgroundRepeat: 'no-repeat',
      padding: { top: 40, bottom: 40, left: 20, right: 20 },
      textColor: '#ffffff',
      linkColor: '#3498db',
      layout: 'three-column',
      showNewsletter: false
    },
    comment: 'Enhanced footer-specific settings'
  },
  layoutSettings: {
    type: DataTypes.JSON,
    allowNull: false,
    defaultValue: {
      contentWidth: 'lg',
      showSidebar: true,
      sidebarPosition: 'right'
    },
    comment: 'Layout-specific settings'
  },
  globalSettings: {
    type: DataTypes.JSON,
    allowNull: false,
    defaultValue: {},
    comment: 'Global settings for typography, colors, spacing, etc.'
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    comment: 'Only one template can be active per type'
  },
  isDefault: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    comment: 'System default template that cannot be deleted'
  },
  version: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
    comment: 'Template version for tracking changes'
  },
  previewImage: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: 'URL to template preview image'
  },
  metadata: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: {},
    comment: 'Additional metadata like author, tags, etc.'
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
    beforeCreate: async (template) => {
      // Generate slug from name if not provided
      if (!template.slug && template.name) {
        template.slug = template.name
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-+|-+$/g, '');
      }
    },
    beforeUpdate: async (template) => {
      // If setting this template as active, deactivate others of the same type
      if (template.changed('isActive') && template.isActive) {
        await Template.update(
          { isActive: false },
          { 
            where: { 
              type: template.type,
              id: { [sequelize.Op.ne]: template.id }
            }
          }
        );
      }
    }
  }
});

// Model associations
Template.associate = (models) => {
  // Template created by user
  Template.belongsTo(models.User, {
    foreignKey: 'createdBy',
    as: 'creator'
  });

  // Template updated by user
  Template.belongsTo(models.User, {
    foreignKey: 'updatedBy',
    as: 'lastEditor'
  });
};

// Instance methods
Template.prototype.toJSON = function() {
  const values = { ...this.get() };
  
  // Ensure configuration is always an object
  if (typeof values.configuration === 'string') {
    try {
      values.configuration = JSON.parse(values.configuration);
    } catch (e) {
      values.configuration = {};
    }
  }
  
  return values;
};

// Static methods
Template.getActiveByType = async function(type) {
  return await this.findOne({
    where: {
      type,
      isActive: true
    }
  });
};

Template.getDefaultByType = async function(type) {
  return await this.findOne({
    where: {
      type,
      isDefault: true
    }
  });
};

Template.createFromConfig = async function(config, userId = null) {
  const template = await this.create({
    name: config.name,
    slug: config.slug,
    type: config.type || 'front_page',
    description: config.description,
    configuration: config.configuration || {},
    headerSettings: config.headerSettings || {},
    footerSettings: config.footerSettings || {},
    layoutSettings: config.layoutSettings || {},
    globalSettings: config.globalSettings || {},
    isActive: config.isActive || false,
    createdBy: userId,
    updatedBy: userId
  });
  
  return template;
};

module.exports = Template;
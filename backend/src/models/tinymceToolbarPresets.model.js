const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const TinymceToolbarPresets = sequelize.define('TinymceToolbarPresets', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: {
        msg: 'Toolbar preset name is required'
      },
      len: {
        args: [1, 100],
        msg: 'Toolbar preset name must be between 1 and 100 characters'
      }
    }
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  toolbar_config: {
    type: DataTypes.JSONB,
    allowNull: false,
    defaultValue: {},
    validate: {
      isValidToolbarConfig(value) {
        if (!value || typeof value !== 'object') {
          throw new Error('Toolbar config must be a valid object');
        }
        
        // Validate that it contains row configurations
        const hasValidRows = Object.keys(value).every(key => {
          return key.startsWith('row') && Array.isArray(value[key]);
        });
        
        if (!hasValidRows) {
          throw new Error('Toolbar config must contain row arrays (e.g., row1, row2)');
        }
      }
    }
  },
  button_order: {
    type: DataTypes.JSONB,
    allowNull: false,
    defaultValue: [],
    validate: {
      isArray(value) {
        if (!Array.isArray(value)) {
          throw new Error('Button order must be an array');
        }
      }
    }
  },
  is_system: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: false,
    comment: 'System presets cannot be modified or deleted'
  }
}, {
  timestamps: true,
  tableName: 'TinymceToolbarPresets',
  hooks: {
    beforeDestroy: async (preset) => {
      if (preset.is_system) {
        throw new Error('System toolbar presets cannot be deleted');
      }
    },
    beforeUpdate: async (preset) => {
      if (preset.is_system && preset.changed()) {
        const changedFields = preset.changed();
        // Allow only description updates for system presets
        if (changedFields.some(field => field !== 'description' && field !== 'updatedAt')) {
          throw new Error('System toolbar presets cannot be modified');
        }
      }
    }
  }
});

// Class methods
TinymceToolbarPresets.getSystemPresets = async function() {
  return await this.findAll({
    where: { is_system: true },
    order: [['name', 'ASC']]
  });
};

TinymceToolbarPresets.getUserPresets = async function() {
  return await this.findAll({
    where: { is_system: false },
    order: [['createdAt', 'DESC']]
  });
};

// Instance methods
TinymceToolbarPresets.prototype.toToolbarString = function() {
  const config = this.toolbar_config;
  const rows = Object.keys(config)
    .sort()
    .map(key => config[key].join(' '))
    .filter(row => row.length > 0);
  
  return rows.join(' | ');
};

TinymceToolbarPresets.prototype.getAllButtons = function() {
  const config = this.toolbar_config;
  const buttons = new Set();
  
  Object.values(config).forEach(row => {
    if (Array.isArray(row)) {
      row.forEach(button => {
        if (button !== '|') {
          buttons.add(button);
        }
      });
    }
  });
  
  return Array.from(buttons);
};

module.exports = TinymceToolbarPresets;
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
  tags: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: []
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
      if (settings.isDefault) {
        await TinymceSettings.update({ isDefault: false }, { where: { isDefault: true } });
      }
    },
    beforeUpdate: async (settings) => {
      if (settings.isDefault) {
        await TinymceSettings.update({ isDefault: false }, { where: { isDefault: true, id: { [Op.ne]: settings.id } } });
      }
    }
  }
});

module.exports = TinymceSettings;
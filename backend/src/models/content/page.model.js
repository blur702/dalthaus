const BaseContent = require('./baseContent.model');

// Page is just a filtered view of BaseContent
class Page {
  static async findAll(options = {}) {
    return BaseContent.findAll({
      ...options,
      where: {
        ...options.where,
        contentType: 'page'
      }
    });
  }

  static async findOne(options = {}) {
    return BaseContent.findOne({
      ...options,
      where: {
        ...options.where,
        contentType: 'page'
      }
    });
  }

  static async findByPk(id, options = {}) {
    return BaseContent.findByPk(id, {
      ...options,
      where: {
        contentType: 'page'
      }
    });
  }

  static async findAndCountAll(options = {}) {
    return BaseContent.findAndCountAll({
      ...options,
      where: {
        ...options.where,
        contentType: 'page'
      }
    });
  }

  static async create(values, options = {}) {
    return BaseContent.create({
      ...values,
      contentType: 'page'
    }, options);
  }
}

// Add self-referencing association
BaseContent.hasMany(BaseContent, { as: 'children', foreignKey: 'parentId' });
BaseContent.belongsTo(BaseContent, { as: 'parent', foreignKey: 'parentId' });

module.exports = Page;
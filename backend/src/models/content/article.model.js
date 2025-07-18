const BaseContent = require('./baseContent.model');

// Article is just a filtered view of BaseContent
class Article {
  static async findAll(options = {}) {
    return BaseContent.findAll({
      ...options,
      where: {
        ...options.where,
        contentType: 'article'
      }
    });
  }

  static async findOne(options = {}) {
    return BaseContent.findOne({
      ...options,
      where: {
        ...options.where,
        contentType: 'article'
      }
    });
  }

  static async findByPk(id, options = {}) {
    return BaseContent.findByPk(id, {
      ...options,
      where: {
        contentType: 'article'
      }
    });
  }

  static async findAndCountAll(options = {}) {
    return BaseContent.findAndCountAll({
      ...options,
      where: {
        ...options.where,
        contentType: 'article'
      }
    });
  }

  static async create(values, options = {}) {
    return BaseContent.create({
      ...values,
      contentType: 'article'
    }, options);
  }
}

module.exports = Article;
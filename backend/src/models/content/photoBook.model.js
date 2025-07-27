const BaseContent = require('./baseContent.model');

// PhotoBook is just a filtered view of BaseContent
class PhotoBook {
  static async findAll(options = {}) {
    return BaseContent.findAll({
      ...options,
      where: {
        ...options.where,
        contentType: 'photoBook'
      }
    });
  }

  static async findOne(options = {}) {
    return BaseContent.findOne({
      ...options,
      where: {
        ...options.where,
        contentType: 'photoBook'
      }
    });
  }

  static async findByPk(id, options = {}) {
    return BaseContent.findByPk(id, {
      ...options,
      where: {
        contentType: 'photoBook'
      }
    });
  }

  static async findAndCountAll(options = {}) {
    return BaseContent.findAndCountAll({
      ...options,
      where: {
        ...options.where,
        contentType: 'photoBook'
      }
    });
  }

  static async create(values, options = {}) {
    return BaseContent.create({
      ...values,
      contentType: 'photoBook'
    }, options);
  }

  static async count(options = {}) {
    return BaseContent.count({
      ...options,
      where: {
        ...options.where,
        contentType: 'photoBook'
      }
    });
  }
}

module.exports = PhotoBook;
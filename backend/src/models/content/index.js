const BaseContent = require('./baseContent.model');
const PhotoBook = require('./photoBook.model');
const Article = require('./article.model');
const Page = require('./page.model');
const User = require('../user.model');

// Set up associations
BaseContent.belongsTo(User, { as: 'author', foreignKey: 'authorId' });
User.hasMany(BaseContent, { as: 'content', foreignKey: 'authorId' });

module.exports = {
  BaseContent,
  PhotoBook,
  Article,
  Page
};
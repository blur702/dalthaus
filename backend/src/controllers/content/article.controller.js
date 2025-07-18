const BaseContentController = require('./base.controller');
const { Article } = require('../../models/content');

class ArticleController extends BaseContentController {
  constructor() {
    super(Article, 'article');
  }

  // Override create to handle Article-specific fields
  async create(req, res) {
    try {
      const { excerpt, featuredImage, category, tags = [], ...baseFields } = req.body;
      
      // Call parent create with Article-specific fields
      req.body = {
        ...baseFields,
        excerpt,
        featuredImage,
        category,
        tags,
        metadata: {
          ...baseFields.metadata,
          type: 'article'
        }
      };
      
      return super.create(req, res);
    } catch (error) {
      console.error('Create Article error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Get articles by category
  async getByCategory(req, res) {
    try {
      const { category } = req.params;
      const { page = 1, limit = 10 } = req.query;
      const offset = (page - 1) * limit;

      const { count, rows } = await Article.findAndCountAll({
        where: { 
          contentType: 'article',
          category,
          status: 'published'
        },
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [['publishedAt', 'DESC']],
        include: [{
          model: require('../../models/user.model'),
          as: 'author',
          attributes: ['id', 'username']
        }]
      });

      res.status(200).json({
        items: rows,
        total: count,
        page: parseInt(page),
        totalPages: Math.ceil(count / limit)
      });
    } catch (error) {
      console.error('Get articles by category error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}

// Create instance and export methods
const articleController = new ArticleController();

module.exports = {
  getAll: (req, res) => articleController.getAll(req, res),
  getById: (req, res) => articleController.getById(req, res),
  getBySlug: (req, res) => articleController.getBySlug(req, res),
  create: (req, res) => articleController.create(req, res),
  update: (req, res) => articleController.update(req, res),
  delete: (req, res) => articleController.delete(req, res),
  getByCategory: (req, res) => articleController.getByCategory(req, res)
};
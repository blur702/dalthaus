const BaseContentController = require('./base.controller');
const { Page } = require('../../models/content');

class PageController extends BaseContentController {
  constructor() {
    super(Page, 'page');
  }

  // Override create to handle Page-specific fields
  async create(req, res) {
    try {
      const { template = 'default', parentId, order = 0, showInMenu = true, ...baseFields } = req.body;
      
      // Call parent create with Page-specific fields
      req.body = {
        ...baseFields,
        template,
        parentId,
        order,
        showInMenu,
        metadata: {
          ...baseFields.metadata,
          type: 'page'
        }
      };
      
      return super.create(req, res);
    } catch (error) {
      console.error('Create Page error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Get menu pages (pages that should show in navigation)
  async getMenuPages(req, res) {
    try {
      const pages = await Page.findAll({
        where: { 
          contentType: 'page',
          status: 'published',
          showInMenu: true,
          parentId: null // Only top-level pages
        },
        order: [['order', 'ASC'], ['title', 'ASC']],
        attributes: ['id', 'title', 'slug', 'order'],
        include: [{
          model: Page,
          as: 'children',
          where: { 
            status: 'published',
            showInMenu: true 
          },
          required: false,
          attributes: ['id', 'title', 'slug', 'order'],
          order: [['order', 'ASC'], ['title', 'ASC']]
        }]
      });

      res.status(200).json(pages);
    } catch (error) {
      console.error('Get menu pages error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Get page hierarchy
  async getHierarchy(req, res) {
    try {
      const pages = await Page.findAll({
        where: { 
          contentType: 'page',
          parentId: null
        },
        order: [['order', 'ASC'], ['title', 'ASC']],
        include: [{
          model: Page,
          as: 'children',
          include: [{
            model: Page,
            as: 'children'
          }]
        }]
      });

      res.status(200).json(pages);
    } catch (error) {
      console.error('Get page hierarchy error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}

// Create instance and export methods
const pageController = new PageController();

module.exports = {
  getAll: (req, res) => pageController.getAll(req, res),
  getById: (req, res) => pageController.getById(req, res),
  getBySlug: (req, res) => pageController.getBySlug(req, res),
  create: (req, res) => pageController.create(req, res),
  update: (req, res) => pageController.update(req, res),
  delete: (req, res) => pageController.delete(req, res),
  getMenuPages: (req, res) => pageController.getMenuPages(req, res),
  getHierarchy: (req, res) => pageController.getHierarchy(req, res)
};
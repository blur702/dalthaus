const { BaseContent, PhotoBook, Article, Page } = require('../../models/content');
const { Op } = require('sequelize');

// Base controller with common CRUD operations
class BaseContentController {
  constructor(model, contentType) {
    this.model = model;
    this.contentType = contentType;
  }

  // Get all content of this type
  async getAll(req, res) {
    try {
      const { status, page = 1, limit = 10, search } = req.query;
      const offset = (page - 1) * limit;

      const where = { contentType: this.contentType };
      
      if (status) {
        where.status = status;
      }
      
      if (search) {
        where[Op.or] = [
          { title: { [Op.iLike]: `%${search}%` } },
          { body: { [Op.iLike]: `%${search}%` } }
        ];
      }

      const { count, rows } = await this.model.findAndCountAll({
        where,
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [['orderIndex', 'ASC'], ['createdAt', 'DESC']],
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
      console.error(`Get all ${this.contentType} error:`, error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Get single content by ID
  async getById(req, res) {
    try {
      const { id } = req.params;
      
      const content = await this.model.findOne({
        where: { id, contentType: this.contentType },
        include: [{
          model: require('../../models/user.model'),
          as: 'author',
          attributes: ['id', 'username']
        }]
      });

      if (!content) {
        return res.status(404).json({ error: `${this.contentType} not found` });
      }

      res.status(200).json(content);
    } catch (error) {
      console.error(`Get ${this.contentType} by ID error:`, error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Create new content
  async create(req, res) {
    try {
      const { title, body, status = 'draft', ...additionalFields } = req.body;
      const authorId = req.user.id;

      if (!title || !body) {
        return res.status(400).json({ error: 'Title and body are required' });
      }

      const newContent = await this.model.create({
        title,
        body,
        status,
        authorId,
        contentType: this.contentType,
        ...additionalFields
      });

      const contentWithAuthor = await this.model.findByPk(newContent.id, {
        include: [{
          model: require('../../models/user.model'),
          as: 'author',
          attributes: ['id', 'username']
        }]
      });

      res.status(201).json({
        message: `${this.contentType} created successfully`,
        content: contentWithAuthor
      });
    } catch (error) {
      console.error(`Create ${this.contentType} error:`, error);
      if (error.name === 'SequelizeUniqueConstraintError') {
        return res.status(409).json({ error: 'A content with this slug already exists' });
      }
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Update content
  async update(req, res) {
    try {
      const { id } = req.params;
      const updates = req.body;

      const content = await this.model.findOne({
        where: { id, contentType: this.contentType }
      });

      if (!content) {
        return res.status(404).json({ error: `${this.contentType} not found` });
      }

      // Update the content
      await content.update(updates);

      const updatedContent = await this.model.findByPk(content.id, {
        include: [{
          model: require('../../models/user.model'),
          as: 'author',
          attributes: ['id', 'username']
        }]
      });

      res.status(200).json({
        message: `${this.contentType} updated successfully`,
        content: updatedContent
      });
    } catch (error) {
      console.error(`Update ${this.contentType} error:`, error);
      if (error.name === 'SequelizeUniqueConstraintError') {
        return res.status(409).json({ error: 'A content with this slug already exists' });
      }
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Delete content
  async delete(req, res) {
    try {
      const { id } = req.params;

      const content = await this.model.findOne({
        where: { id, contentType: this.contentType }
      });

      if (!content) {
        return res.status(404).json({ error: `${this.contentType} not found` });
      }

      await content.destroy();

      res.status(200).json({ message: `${this.contentType} deleted successfully` });
    } catch (error) {
      console.error(`Delete ${this.contentType} error:`, error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Get content by slug
  async getBySlug(req, res) {
    try {
      const { slug } = req.params;
      
      const content = await this.model.findOne({
        where: { slug, contentType: this.contentType },
        include: [{
          model: require('../../models/user.model'),
          as: 'author',
          attributes: ['id', 'username']
        }]
      });

      if (!content) {
        return res.status(404).json({ error: `${this.contentType} not found` });
      }

      res.status(200).json(content);
    } catch (error) {
      console.error(`Get ${this.contentType} by slug error:`, error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Update order of content items
  async updateOrder(req, res) {
    try {
      const { items } = req.body;
      
      if (!items || !Array.isArray(items)) {
        return res.status(400).json({ error: 'Items array is required' });
      }

      // Update each item's orderIndex
      const updatePromises = items.map((item, index) => {
        return this.model.update(
          { orderIndex: index },
          { where: { id: item.id, contentType: this.contentType } }
        );
      });

      await Promise.all(updatePromises);

      res.status(200).json({ message: 'Order updated successfully' });
    } catch (error) {
      console.error(`Update ${this.contentType} order error:`, error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}

module.exports = BaseContentController;
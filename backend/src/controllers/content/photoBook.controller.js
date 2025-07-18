const BaseContentController = require('./base.controller');
const { PhotoBook } = require('../../models/content');

class PhotoBookController extends BaseContentController {
  constructor() {
    super(PhotoBook, 'photoBook');
  }

  // Override create to handle PhotoBook-specific fields
  async create(req, res) {
    try {
      const { coverImage, photoCount = 0, ...baseFields } = req.body;
      
      // Call parent create with PhotoBook-specific fields
      req.body = {
        ...baseFields,
        coverImage,
        photoCount,
        metadata: {
          ...baseFields.metadata,
          type: 'photoBook'
        }
      };
      
      return super.create(req, res);
    } catch (error) {
      console.error('Create PhotoBook error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}

// Create instance and export methods
const photoBookController = new PhotoBookController();

module.exports = {
  getAll: (req, res) => photoBookController.getAll(req, res),
  getById: (req, res) => photoBookController.getById(req, res),
  getBySlug: (req, res) => photoBookController.getBySlug(req, res),
  create: (req, res) => photoBookController.create(req, res),
  update: (req, res) => photoBookController.update(req, res),
  delete: (req, res) => photoBookController.delete(req, res)
};
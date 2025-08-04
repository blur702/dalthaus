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

// Create instance and bind methods
const photoBookController = new PhotoBookController();

// Bind all methods to preserve 'this' context
module.exports = {
  getAll: photoBookController.getAll.bind(photoBookController),
  getById: photoBookController.getById.bind(photoBookController),
  getBySlug: photoBookController.getBySlug.bind(photoBookController),
  create: photoBookController.create.bind(photoBookController),
  update: photoBookController.update.bind(photoBookController),
  delete: photoBookController.delete.bind(photoBookController),
  updateOrder: photoBookController.updateOrder.bind(photoBookController)
};
const multer = require('multer');
const documentConverterService = require('../services/documentConverter');

// Configure multer for memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 50 * 1024 * 1024 // 50MB limit
  },
  fileFilter: (req, file, cb) => {
    if (documentConverterService.isFormatSupported(file.originalname)) {
      cb(null, true);
    } else {
      cb(new Error('Unsupported file format'));
    }
  }
});

class DocumentUploadController {
  /**
   * Handle document upload and conversion
   */
  async uploadAndConvert(req, res) {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: 'No file uploaded'
        });
      }

      // Get allowed tags from request (optional)
      const allowedTags = req.body.allowedTags ? 
        req.body.allowedTags.split(',').map(tag => tag.trim()) : 
        null;

      // Convert document
      const result = await documentConverterService.convertDocument(
        req.file.buffer,
        req.file.originalname,
        allowedTags
      );

      res.json({
        success: true,
        data: result
      });

    } catch (error) {
      console.error('Upload error:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to convert document'
      });
    }
  }

  /**
   * Get supported document formats
   */
  async getSupportedFormats(req, res) {
    try {
      const formats = await documentConverterService.getSupportedFormats();
      res.json({
        success: true,
        data: formats
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to fetch supported formats'
      });
    }
  }

  /**
   * Check conversion service health
   */
  async checkHealth(req, res) {
    try {
      const isHealthy = await documentConverterService.checkHealth();
      res.json({
        success: true,
        data: {
          healthy: isHealthy
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to check service health'
      });
    }
  }
}

module.exports = {
  controller: new DocumentUploadController(),
  upload
};
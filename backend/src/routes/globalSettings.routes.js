const express = require('express');
const router = express.Router();
const globalSettingsController = require('../controllers/globalSettings.controller');
const { protect, isAdmin } = require('../middleware/auth.middleware');
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;

// All routes require authentication and admin role
router.use(protect);
router.use(isAdmin);

// Get global settings
router.get('/global', globalSettingsController.getGlobalSettings);

// Get global settings with metadata
router.get('/global/metadata', globalSettingsController.getGlobalSettingsWithMetadata);

// Update global settings
router.put('/global', globalSettingsController.updateGlobalSettings);

// Reset global settings to defaults
router.post('/global/reset', globalSettingsController.resetGlobalSettings);

// Export global settings
router.get('/global/export', globalSettingsController.exportGlobalSettings);

// Import global settings
router.post('/global/import', globalSettingsController.importGlobalSettings);

// Configure multer for header background image uploads
const headerUploadDir = path.join(__dirname, '../../../uploads/headers');
fs.mkdir(headerUploadDir, { recursive: true }).catch(console.error);

const headerStorage = multer.diskStorage({
  destination: async (req, file, cb) => {
    cb(null, headerUploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const timestamp = Date.now();
    const random = Math.round(Math.random() * 1E6);
    cb(null, `header-bg-${timestamp}-${random}${ext}`);
  }
});

const headerUpload = multer({
  storage: headerStorage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit for header images
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

// Upload header background image
router.post('/global/header-image', headerUpload.single('image'), globalSettingsController.uploadHeaderImage);

// Delete header background image
router.delete('/global/header-image', globalSettingsController.deleteHeaderImage);

module.exports = router;
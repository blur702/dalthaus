const express = require('express');
const router = express.Router();
const { controller, upload } = require('../controllers/documentUpload.controller');
const { protect } = require('../middleware/auth.middleware');

// Upload and convert document
router.post('/convert', protect, upload.single('document'), controller.uploadAndConvert.bind(controller));

// Get supported formats
router.get('/formats', protect, controller.getSupportedFormats.bind(controller));

// Check service health
router.get('/health', protect, controller.checkHealth.bind(controller));

module.exports = router;
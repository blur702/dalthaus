const express = require('express');
const router = express.Router();
const globalSettingsController = require('../controllers/globalSettings.controller');
const { protect, isAdmin } = require('../middleware/auth.middleware');

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

module.exports = router;
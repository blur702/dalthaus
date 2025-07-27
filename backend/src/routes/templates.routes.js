const express = require('express');
const router = express.Router();
const templatesController = require('../controllers/templates.controller');
const { protect } = require('../middleware/auth.middleware');

// Public routes (for fetching active templates)
router.get('/active/:type', templatesController.getActiveTemplate);

// Protected routes (require authentication)
router.use(protect);

// Global settings (must come before :id routes)
router.get('/global-settings', templatesController.getGlobalSettings);
router.put('/global-settings', templatesController.updateGlobalSettings);

// CRUD operations
router.get('/', templatesController.getAllTemplates);
router.get('/:id', templatesController.getTemplate);
router.post('/', templatesController.createTemplate);
router.put('/:id', templatesController.updateTemplate);
router.delete('/:id', templatesController.deleteTemplate);

// Special operations
router.post('/:id/clone', templatesController.cloneTemplate);
router.get('/:id/export', templatesController.exportTemplate);
router.post('/import', templatesController.importTemplate);

module.exports = router;
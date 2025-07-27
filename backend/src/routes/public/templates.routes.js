const express = require('express');
const router = express.Router();
const templatesController = require('../../controllers/public/templates.controller');

// Get active template by type
router.get('/active/:type', templatesController.getActiveTemplate);

// Get template by slug
router.get('/:slug', templatesController.getTemplateBySlug);

module.exports = router;
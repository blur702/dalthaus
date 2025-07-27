const express = require('express');
const router = express.Router();
const articleController = require('../../controllers/content/article.controller');
const { protect, isAdmin } = require('../../middleware/auth.middleware');

// Public routes
router.get('/', articleController.getAll);
router.get('/category/:category', articleController.getByCategory);
router.get('/by-id/:id', articleController.getById);
router.get('/:slug', articleController.getBySlug);

// Protected routes (require authentication and admin role)
router.use(protect, isAdmin);
router.post('/', articleController.create);
router.put('/:id', articleController.update);
router.delete('/:id', articleController.delete);

module.exports = router;
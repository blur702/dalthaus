const express = require('express');
const router = express.Router();
const articleController = require('../../controllers/content/article.controller');
const { protect, isAdmin } = require('../../middleware/auth.middleware');

// Public routes
router.get('/', articleController.getAll);
router.get('/:id', articleController.getById);
router.get('/slug/:slug', articleController.getBySlug);
router.get('/category/:category', articleController.getByCategory);

// Protected routes (require authentication and admin role)
router.use(protect, isAdmin);
router.post('/', articleController.create);
router.put('/:id', articleController.update);
router.delete('/:id', articleController.delete);

module.exports = router;
const express = require('express');
const router = express.Router();
const pageController = require('../../controllers/content/page.controller');
const { protect, isAdmin } = require('../../middleware/auth.middleware');

// Public routes
router.get('/', pageController.getAll);
router.get('/menu', pageController.getMenuPages);
router.get('/hierarchy', pageController.getHierarchy);
router.get('/:id', pageController.getById);
router.get('/slug/:slug', pageController.getBySlug);

// Protected routes (require authentication and admin role)
router.use(protect, isAdmin);
router.post('/', pageController.create);
router.put('/:id', pageController.update);
router.delete('/:id', pageController.delete);

module.exports = router;
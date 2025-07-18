const express = require('express');
const router = express.Router();
const photoBookController = require('../../controllers/content/photoBook.controller');
const { protect, isAdmin } = require('../../middleware/auth.middleware');

// Public routes
router.get('/', photoBookController.getAll);
router.get('/:id', photoBookController.getById);
router.get('/slug/:slug', photoBookController.getBySlug);

// Protected routes (require authentication and admin role)
router.use(protect, isAdmin);
router.post('/', photoBookController.create);
router.put('/:id', photoBookController.update);
router.delete('/:id', photoBookController.delete);

module.exports = router;
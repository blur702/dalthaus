const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { protect } = require('../middleware/auth.middleware');

router.post('/login', authController.login);
router.get('/verify', protect, authController.verify);

module.exports = router;
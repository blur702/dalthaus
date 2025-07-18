const express = require('express');
const { createUser } = require('../controllers/user.controller');
const { protect, isAdmin } = require('../middleware/auth.middleware');

const router = express.Router();

// POST /api/users
// This route is protected. A user must be logged in (protect) and have an admin/superuser role (isAdmin).
router.post('/', protect, isAdmin, createUser);

module.exports = router;
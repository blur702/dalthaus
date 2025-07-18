const express = require('express');
const { 
  getUsers, 
  getUser, 
  createUser, 
  updateUser, 
  deleteUser 
} = require('../controllers/user.controller');
const { protect, isAdmin } = require('../middleware/auth.middleware');

const router = express.Router();

// All routes require authentication and admin privileges
router.use(protect, isAdmin);

// GET /api/users - Get all users
router.get('/', getUsers);

// GET /api/users/:id - Get single user
router.get('/:id', getUser);

// POST /api/users - Create new user
router.post('/', createUser);

// PUT /api/users/:id - Update user
router.put('/:id', updateUser);

// DELETE /api/users/:id - Delete user
router.delete('/:id', deleteUser);

module.exports = router;
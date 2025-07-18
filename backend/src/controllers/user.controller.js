const bcryptjs = require('bcryptjs');
const User = require('../models/user.model');

// Get all users
const getUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ['id', 'username', 'role', 'createdAt', 'updatedAt'],
      order: [['createdAt', 'DESC']]
    });

    res.status(200).json({
      users,
      count: users.length
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get single user
const getUser = async (req, res) => {
  try {
    const { id } = req.params;
    
    const user = await User.findByPk(id, {
      attributes: ['id', 'username', 'role', 'createdAt', 'updatedAt']
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Create user
const createUser = async (req, res) => {
  try {
    const { username, password, role = 'admin' } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    // Check if user already exists
    const userExists = await User.findOne({ where: { username } });
    if (userExists) {
      return res.status(409).json({ error: 'Username already exists' });
    }

    const hashedPassword = await bcryptjs.hash(password, 12);

    const newUser = await User.create({
      username,
      passwordHash: hashedPassword,
      role
    });

    res.status(201).json({
      message: 'User created successfully',
      user: {
        id: newUser.id,
        username: newUser.username,
        role: newUser.role,
        createdAt: newUser.createdAt
      }
    });
  } catch (error) {
    console.error('Create user error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Update user
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { username, password, role } = req.body;

    const user = await User.findByPk(id);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Prevent updating the last superuser
    if (user.role === 'superuser' && role !== 'superuser') {
      const superuserCount = await User.count({ where: { role: 'superuser' } });
      if (superuserCount === 1) {
        return res.status(400).json({ error: 'Cannot remove superuser role from the last superuser' });
      }
    }

    // Update fields
    if (username) {
      // Check if new username already exists
      const usernameExists = await User.findOne({ 
        where: { username, id: { [require('sequelize').Op.ne]: id } } 
      });
      if (usernameExists) {
        return res.status(409).json({ error: 'Username already exists' });
      }
      user.username = username;
    }

    if (password) {
      user.passwordHash = await bcryptjs.hash(password, 12);
    }

    if (role) {
      user.role = role;
    }

    await user.save();

    res.status(200).json({
      message: 'User updated successfully',
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
        updatedAt: user.updatedAt
      }
    });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Delete user
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Prevent deleting yourself
    if (user.id === req.user.id) {
      return res.status(400).json({ error: 'Cannot delete your own account' });
    }

    // Prevent deleting the last superuser
    if (user.role === 'superuser') {
      const superuserCount = await User.count({ where: { role: 'superuser' } });
      if (superuserCount === 1) {
        return res.status(400).json({ error: 'Cannot delete the last superuser' });
      }
    }

    await user.destroy();

    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser
};
const bcryptjs = require('bcryptjs');
const User = require('../models/user.model');

const createUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    // Check if user already exists
    const userExists = await User.findOne({ where: { username } });
    if (userExists) {
      return res.status(409).json({ error: 'Username already exists' }); // 409 Conflict
    }

    const hashedPassword = await bcryptjs.hash(password, 12);

    const newUser = await User.create({
      username,
      passwordHash: hashedPassword,
      role: 'admin' // All users created via this endpoint are admins
    });

    res.status(201).json({
      message: 'User created successfully',
      user: {
        id: newUser.id,
        username: newUser.username,
        role: newUser.role
      }
    });
  } catch (error) {
    console.error('Create user error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  createUser
};
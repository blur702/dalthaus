require('dotenv').config(); // Load environment variables

const express = require('express');
const cors = require('cors');
const bcryptjs = require('bcryptjs');
const path = require('path');
const sequelize = require('./src/config/database');
const User = require('./src/models/user.model');

// Import content models to register them
require('./src/models/content');

const authRoutes = require('./src/routes/auth.routes');
const userRoutes = require('./src/routes/user.routes');
const photoBookRoutes = require('./src/routes/content/photoBook.routes');
const articleRoutes = require('./src/routes/content/article.routes');
const pageRoutes = require('./src/routes/content/page.routes');

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(express.json());
app.use(cors());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/content/photo-books', photoBookRoutes);
app.use('/api/content/articles', articleRoutes);
app.use('/api/content/pages', pageRoutes);

// Production deployment configuration
if (process.env.NODE_ENV === 'production') {
  // Serve static files from the React app
  app.use(express.static('/var/www/public_html'));

  // Catch-all route for React Router
  app.get('*', (req, res) => {
    res.sendFile(path.join('/var/www/public_html', 'index.html'));
  });
}

// Admin user seeding function
async function seedAdminUser() {
  try {
    const hashedPassword = await bcryptjs.hash('(130Bpm)', 12);
    
    const [adminUser, created] = await User.findOrCreate({
      where: { username: 'admin' },
      defaults: {
        username: 'admin',
        passwordHash: hashedPassword,
        role: 'superuser'
      }
    });

    if (created) {
      console.log('Admin user created successfully');
    } else {
      console.log('Admin user already exists');
    }
  } catch (error) {
    console.error('Error seeding admin user:', error);
  }
}

// Database connection and server start
async function startServer() {
  try {
    await sequelize.authenticate();
    console.log('Database connection established successfully');
    
    await sequelize.sync();
    console.log('Database synchronized');
    
    await seedAdminUser();
    
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Unable to start server:', error);
    process.exit(1);
  }
}

startServer();
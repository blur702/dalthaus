require('dotenv').config(); // Load environment variables

const express = require('express');
const cors = require('cors');
const bcryptjs = require('bcryptjs');
const path = require('path');
const sequelize = require('./src/config/database');
const User = require('./src/models/user.model');
const TinymceSettings = require('./src/models/tinymceSettings.model');

// Import content models to register them
require('./src/models/content');

const authRoutes = require('./src/routes/auth.routes');
const userRoutes = require('./src/routes/user.routes');
const photoBookRoutes = require('./src/routes/content/photoBook.routes');
const articleRoutes = require('./src/routes/content/article.routes');
const pageRoutes = require('./src/routes/content/page.routes');
const documentUploadRoutes = require('./src/routes/documentUpload.routes');
const tinymceSettingsRoutes = require('./src/routes/tinymceSettings.routes');
const uploadRoutes = require('./src/routes/upload.routes');

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(express.json());
app.use(cors());

// Serve uploaded images statically
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/content/photo-books', photoBookRoutes);
app.use('/api/content/articles', articleRoutes);
app.use('/api/content/pages', pageRoutes);
app.use('/api/document', documentUploadRoutes);
app.use('/api/admin/tinymce-settings', tinymceSettingsRoutes);
app.use('/api/upload', uploadRoutes);

// Public API routes (no authentication required)
const publicRoutes = require('./src/routes/public.routes');
app.use('/api/public', publicRoutes);

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

// TinyMCE preset configurations seeding function
async function seedTinymcePresets() {
  try {
    const presets = [
      {
        name: 'Basic Editor',
        description: 'Simple text editor with basic formatting options',
        isPreset: true,
        isDefault: true,
        tags: ['basic', 'simple', 'minimal'],
        settings: {
          height: 300,
          menubar: false,
          plugins: ['lists', 'link', 'searchreplace', 'code'],
          toolbar: 'undo redo | bold italic | alignleft aligncenter alignright | bullist numlist | link | code',
          content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
        }
      },
      {
        name: 'Full Featured',
        description: 'Complete editor with all available features',
        isPreset: true,
        isDefault: false,
        tags: ['full', 'advanced', 'complete'],
        settings: {
          height: 500,
          menubar: true,
          plugins: [
            'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
            'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
            'insertdatetime', 'media', 'table', 'wordcount', 'pagebreak'
          ],
          toolbar: 'undo redo | blocks | bold italic forecolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image media | pagebreak | removeformat | code',
          pagebreak_separator: '<!-- pagebreak -->',
          pagebreak_split_block: true,
          relative_urls: false,
          remove_script_host: false,
          convert_urls: false,
          automatic_uploads: true,
          images_reuse_filename: true,
          file_picker_types: 'image',
          content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px } img { max-width: 100%; height: auto; display: block; margin: 10px 0; }'
        }
      },
      {
        name: 'Blog Post Editor',
        description: 'Optimized for writing blog posts and articles',
        isPreset: true,
        isDefault: false,
        tags: ['blog', 'article', 'content'],
        settings: {
          height: 400,
          menubar: false,
          plugins: [
            'advlist', 'autolink', 'lists', 'link', 'image', 'charmap',
            'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
            'insertdatetime', 'media', 'table', 'wordcount'
          ],
          toolbar: 'undo redo | formatselect | bold italic backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image | removeformat | help',
          block_formats: 'Paragraph=p; Header 1=h1; Header 2=h2; Header 3=h3; Header 4=h4; Quote=blockquote; Code=pre',
          content_style: 'body { font-family:Georgia,serif; font-size:16px; line-height:1.6; max-width:800px; margin:0 auto; } blockquote { border-left: 3px solid #ccc; margin-left: 0; padding-left: 20px; }'
        }
      },
      {
        name: 'Email Template',
        description: 'Editor configured for creating email templates',
        isPreset: true,
        isDefault: false,
        tags: ['email', 'template', 'newsletter'],
        settings: {
          height: 400,
          menubar: false,
          plugins: ['lists', 'link', 'image', 'table', 'code', 'visualblocks'],
          toolbar: 'undo redo | bold italic | alignleft aligncenter alignright | bullist numlist | link image | table | code visualblocks',
          forced_root_block: 'div',
          convert_urls: false,
          relative_urls: false,
          remove_script_host: false,
          table_default_attributes: {
            border: '0',
            cellpadding: '0',
            cellspacing: '0'
          },
          content_style: 'body { font-family:Arial,sans-serif; font-size:14px; } table { border-collapse: collapse; }'
        }
      },
      {
        name: 'Documentation',
        description: 'Technical documentation editor with code highlighting',
        isPreset: true,
        isDefault: false,
        tags: ['docs', 'technical', 'code'],
        settings: {
          height: 600,
          menubar: true,
          plugins: [
            'advlist', 'autolink', 'lists', 'link', 'image', 'charmap',
            'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
            'insertdatetime', 'table', 'wordcount', 'codesample'
          ],
          toolbar: 'undo redo | blocks | bold italic | alignleft aligncenter alignright | bullist numlist outdent indent | link image | codesample | table | code',
          codesample_languages: [
            { text: 'HTML/XML', value: 'markup' },
            { text: 'JavaScript', value: 'javascript' },
            { text: 'CSS', value: 'css' },
            { text: 'PHP', value: 'php' },
            { text: 'Python', value: 'python' },
            { text: 'Java', value: 'java' },
            { text: 'C++', value: 'cpp' },
            { text: 'C#', value: 'csharp' },
            { text: 'Bash', value: 'bash' }
          ],
          content_style: 'body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; font-size: 14px; line-height: 1.6; } code { background-color: #f4f4f4; padding: 2px 4px; border-radius: 3px; }'
        }
      }
    ];

    for (const preset of presets) {
      const [setting, created] = await TinymceSettings.findOrCreate({
        where: { name: preset.name, isPreset: true },
        defaults: preset
      });
      
      if (created) {
        console.log(`TinyMCE preset '${preset.name}' created successfully`);
      }
    }
    
    console.log('TinyMCE presets seeding completed');
  } catch (error) {
    console.error('Error seeding TinyMCE presets:', error);
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
    await seedTinymcePresets();
    
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Unable to start server:', error);
    process.exit(1);
  }
}

startServer();
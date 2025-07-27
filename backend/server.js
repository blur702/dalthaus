require('dotenv').config(); // Load environment variables

const express = require('express');
const cors = require('cors');
const bcryptjs = require('bcryptjs');
const path = require('path');
const https = require('https');
const http = require('http');
const fs = require('fs');
const sequelize = require('./src/config/database');
const User = require('./src/models/user.model');
const TinymceSettings = require('./src/models/tinymceSettings.model');
const Template = require('./src/models/templates.model');

// Import content models to register them
require('./src/models/content');

const authRoutes = require('./src/routes/auth.routes');
const userRoutes = require('./src/routes/user.routes');
const photoBookRoutes = require('./src/routes/content/photoBook.routes');
const articleRoutes = require('./src/routes/content/article.routes');
const pageRoutes = require('./src/routes/content/page.routes');
const documentUploadRoutes = require('./src/routes/documentUpload.routes');
const tinymceSettingsRoutes = require('./src/routes/tinymceSettings.routes');
const tinymceRoutes = require('./src/routes/tinymce.routes');
const uploadRoutes = require('./src/routes/upload.routes');
const settingsRoutes = require('./src/routes/settings.routes');
const templateRoutes = require('./src/routes/templates.routes');
const globalSettingsRoutes = require('./src/routes/globalSettings.routes');

// Import maintenance middleware
const { checkMaintenanceMode } = require('./src/middleware/maintenance.middleware');

const app = express();
const PORT = process.env.PORT || 5001;
const HTTP_PORT = process.env.HTTP_PORT || 80;
const HTTPS_PORT = process.env.HTTPS_PORT || 443;
const USE_HTTPS = process.env.USE_HTTPS === 'true' || fs.existsSync(path.join(__dirname, 'ssl/cert.pem'));

// Middleware
app.use(express.json());
app.use(cors());

// Serve uploaded images statically
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// API Routes - Auth (never blocked by maintenance)
app.use('/api/auth', authRoutes);

// API Routes - Admin (protected by auth middleware, not maintenance)
app.use('/api/users', userRoutes);
app.use('/api/admin/tinymce-settings', tinymceSettingsRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/settings', globalSettingsRoutes);
app.use('/api/templates', templateRoutes);
app.use('/api/tinymce', tinymceRoutes);
app.use('/api/upload', uploadRoutes);

// API Routes - Content (could be affected by maintenance)
app.use('/api/content/photo-books', photoBookRoutes);
app.use('/api/content/articles', articleRoutes);
app.use('/api/content/pages', pageRoutes);
app.use('/api/document', documentUploadRoutes);

// Public API routes (no authentication required - affected by maintenance)
const publicRoutes = require('./src/routes/public.routes');
app.use('/api/public', checkMaintenanceMode, publicRoutes);

// Apply maintenance check to uploaded files
app.use('/uploads', checkMaintenanceMode);

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
      // Removed console statement
    } else {
      // Removed console statement
    }
  } catch (error) {
    // Removed console statement
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
          plugins: ['lists', 'link', 'searchreplace', 'code', 'pagebreak'],
          toolbar: 'undo redo | bold italic | alignleft aligncenter alignright | bullist numlist | link | code',
          content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
        }
      },
      {
        name: 'Common Editor',
        description: 'Locked editor with common functions including pagebreak. Can be duplicated but not deleted.',
        isPreset: true,
        isLocked: true,
        isDefault: false,
        profileType: 'system',
        priority: 10,
        tags: ['common', 'locked', 'pagebreak'],
        settings: {
          height: 400,
          menubar: false,
          plugins: [
            'lists', 'link', 'image', 'charmap', 'preview',
            'anchor', 'searchreplace', 'visualblocks', 'code',
            'insertdatetime', 'table', 'wordcount', 'pagebreak'
          ],
          toolbar: 'undo redo | formatselect | bold italic backcolor | ' +
                   'alignleft aligncenter alignright alignjustify | ' +
                   'bullist numlist outdent indent | link image | ' +
                   'table | pagebreak | removeformat | code',
          pagebreak_separator: '<!-- pagebreak -->',
          pagebreak_split_block: true,
          content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
          image_advtab: true,
          table_default_attributes: {
            border: '1'
          },
          table_default_styles: {
            'border-collapse': 'collapse',
            'width': '100%'
          }
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
            'insertdatetime', 'media', 'table', 'wordcount', 'pagebreak'
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
          plugins: ['lists', 'link', 'image', 'table', 'code', 'visualblocks', 'pagebreak'],
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
            'insertdatetime', 'table', 'wordcount', 'codesample', 'pagebreak'
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
        // Removed console statement
      }
    }
    
    // Removed console statement
  } catch (error) {
    // Removed console statement
  }
}

// Template seeding function
async function seedDefaultTemplates() {
  try {
    const defaultTemplates = [
      {
        name: 'Classic Photography',
        slug: 'classic-photography',
        type: 'front_page',
        description: 'A clean, professional template for photography websites',
        isDefault: true,
        isActive: true,
        configuration: {
          siteTitle: 'Don Althaus',
          siteSubtitle: 'photography',
          missionTitle: "It's all about storytelling...",
          missionText: "Effective storytelling is the heart and soul of photography.",
          showMission: true,
          primaryColor: '#2c3e50',
          backgroundColor: '#ffffff',
          textColor: '#333333'
        },
        headerSettings: {
          headerVariant: 'banner',
          showNavigation: true,
          navPosition: 'below'
        },
        footerSettings: {
          footerVariant: 'detailed',
          showContactInfo: true,
          showSocialLinks: true
        },
        layoutSettings: {
          contentWidth: 'lg',
          showSidebar: false
        }
      }
    ];

    for (const templateData of defaultTemplates) {
      const [template, created] = await Template.findOrCreate({
        where: { slug: templateData.slug },
        defaults: templateData
      });
      
      if (created) {
        // Removed console statement
      }
    }
  } catch (error) {
    // Removed console statement
  }
}

// Database connection and server start
async function startServer() {
  try {
    await sequelize.authenticate();
    console.log('Database connection established successfully');
    
    await sequelize.sync();
    console.log('Database synchronized')
    
    await seedAdminUser();
    // await seedTinymcePresets(); // Temporarily disabled due to foreign key issues
    await seedDefaultTemplates();
    
    // For development, continue using the single port
    if (process.env.NODE_ENV === 'development') {
      app.listen(PORT, '0.0.0.0', () => {
        console.log(`Development server running on port ${PORT}`);
      });
    } else {
      // For production/shared hosting, set up HTTP and HTTPS servers
      const httpServer = http.createServer(app);
      
      httpServer.listen(HTTP_PORT, '0.0.0.0', () => {
        console.log(`HTTP server running on port ${HTTP_PORT}`);
      });

      if (USE_HTTPS) {
        try {
          const httpsOptions = {
            key: fs.readFileSync(path.join(__dirname, 'ssl/key.pem')),
            cert: fs.readFileSync(path.join(__dirname, 'ssl/cert.pem'))
          };
          
          const httpsServer = https.createServer(httpsOptions, app);
          
          httpsServer.listen(HTTPS_PORT, '0.0.0.0', () => {
            console.log(`HTTPS server running on port ${HTTPS_PORT}`);
          });
        } catch (error) {
          console.error('Failed to start HTTPS server:', error);
          console.log('Continuing with HTTP only');
        }
      }
    }
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
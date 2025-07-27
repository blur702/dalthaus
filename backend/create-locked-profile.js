require('dotenv').config();
const sequelize = require('./src/config/database');
const { TinymceSettings } = require('./src/models');

async function createLockedProfile() {
  try {
    await sequelize.authenticate();
    console.log('Database connected');

    // Check if Common Editor already exists
    const existing = await TinymceSettings.findOne({
      where: { name: 'Common Editor' }
    });

    if (existing) {
      console.log('Common Editor profile already exists');
      return;
    }

    // Create the locked profile
    const commonEditor = await TinymceSettings.create({
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
    }, {
      // Skip the afterCreate hook to avoid the foreign key issue
      hooks: false
    });

    console.log('✓ Created locked Common Editor profile');
    console.log('  - ID:', commonEditor.id);
    console.log('  - Name:', commonEditor.name);
    console.log('  - Locked:', commonEditor.isLocked);
    console.log('  - Plugins include pagebreak:', commonEditor.settings.plugins.includes('pagebreak'));

  } catch (error) {
    console.error('Error creating locked profile:', error);
  } finally {
    await sequelize.close();
  }
}

createLockedProfile();
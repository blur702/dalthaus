'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('TinymceToolbarPresets', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false
      },
      name: {
        type: Sequelize.STRING(100),
        allowNull: false,
        unique: true
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      toolbar_config: {
        type: Sequelize.JSONB,
        allowNull: false,
        defaultValue: {}
      },
      button_order: {
        type: Sequelize.JSONB,
        allowNull: false,
        defaultValue: []
      },
      is_system: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: false
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });

    // Add index on name for faster lookups
    await queryInterface.addIndex('TinymceToolbarPresets', ['name'], {
      name: 'idx_toolbar_presets_name'
    });

    // Insert default system presets
    await queryInterface.bulkInsert('TinymceToolbarPresets', [
      {
        id: Sequelize.literal('gen_random_uuid()'),
        name: 'Basic',
        description: 'Basic toolbar with essential formatting tools',
        toolbar_config: JSON.stringify({
          row1: ['undo', 'redo', '|', 'bold', 'italic', 'underline', '|', 'link', 'image']
        }),
        button_order: JSON.stringify(['undo', 'redo', 'bold', 'italic', 'underline', 'link', 'image']),
        is_system: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: Sequelize.literal('gen_random_uuid()'),
        name: 'Standard',
        description: 'Standard toolbar with common formatting options',
        toolbar_config: JSON.stringify({
          row1: ['undo', 'redo', '|', 'bold', 'italic', 'underline', 'strikethrough', '|', 'forecolor', 'backcolor'],
          row2: ['alignleft', 'aligncenter', 'alignright', 'alignjustify', '|', 'bullist', 'numlist', 'outdent', 'indent', '|', 'link', 'image', 'media']
        }),
        button_order: JSON.stringify([
          'undo', 'redo', 'bold', 'italic', 'underline', 'strikethrough',
          'forecolor', 'backcolor', 'alignleft', 'aligncenter', 'alignright',
          'alignjustify', 'bullist', 'numlist', 'outdent', 'indent', 'link',
          'image', 'media'
        ]),
        is_system: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: Sequelize.literal('gen_random_uuid()'),
        name: 'Advanced',
        description: 'Advanced toolbar with all formatting tools',
        toolbar_config: JSON.stringify({
          row1: ['undo', 'redo', '|', 'formatselect', 'blocks', '|', 'bold', 'italic', 'underline', 'strikethrough', '|', 'forecolor', 'backcolor', 'removeformat'],
          row2: ['alignleft', 'aligncenter', 'alignright', 'alignjustify', '|', 'bullist', 'numlist', 'outdent', 'indent', '|', 'blockquote', 'subscript', 'superscript'],
          row3: ['link', 'image', 'media', 'table', '|', 'charmap', 'emoticons', 'hr', '|', 'pagebreak', '|', 'preview', 'fullscreen', 'code']
        }),
        button_order: JSON.stringify([
          'undo', 'redo', 'formatselect', 'blocks', 'bold', 'italic', 'underline',
          'strikethrough', 'forecolor', 'backcolor', 'removeformat', 'alignleft',
          'aligncenter', 'alignright', 'alignjustify', 'bullist', 'numlist',
          'outdent', 'indent', 'blockquote', 'subscript', 'superscript', 'link',
          'image', 'media', 'table', 'charmap', 'emoticons', 'hr', 'pagebreak',
          'preview', 'fullscreen', 'code'
        ]),
        is_system: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    // Remove index
    await queryInterface.removeIndex('TinymceToolbarPresets', 'idx_toolbar_presets_name');
    
    // Drop table
    await queryInterface.dropTable('TinymceToolbarPresets');
  }
};
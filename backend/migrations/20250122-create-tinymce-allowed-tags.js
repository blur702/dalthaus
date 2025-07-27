'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('TinymceAllowedTags', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false
      },
      profile_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'TinymceSettings',
          key: 'id'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      },
      tag_name: {
        type: Sequelize.STRING(50),
        allowNull: false,
        validate: {
          is: /^[a-zA-Z][a-zA-Z0-9]*$/
        }
      },
      attributes: {
        type: Sequelize.JSONB,
        defaultValue: {},
        allowNull: false,
        comment: 'Allowed attributes for this tag with their configurations'
      },
      is_void: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: false,
        comment: 'Whether this is a void element (self-closing)'
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });

    // Add unique constraint on profile_id + tag_name
    await queryInterface.addConstraint('TinymceAllowedTags', {
      fields: ['profile_id', 'tag_name'],
      type: 'unique',
      name: 'unique_profile_tag'
    });

    // Add indexes for performance
    await queryInterface.addIndex('TinymceAllowedTags', ['profile_id'], {
      name: 'idx_allowed_tags_profile'
    });

    await queryInterface.addIndex('TinymceAllowedTags', ['tag_name'], {
      name: 'idx_allowed_tags_name'
    });

    // Insert default allowed tags for existing profiles
    await queryInterface.sequelize.query(`
      INSERT INTO "TinymceAllowedTags" (id, profile_id, tag_name, attributes, is_void, "createdAt")
      SELECT 
        gen_random_uuid(),
        ts.id,
        tag.tag_name,
        tag.attributes,
        tag.is_void,
        CURRENT_TIMESTAMP
      FROM "TinymceSettings" ts
      CROSS JOIN (
        VALUES 
          ('p', '{"class": {"type": "string"}, "style": {"type": "string"}, "id": {"type": "string"}}'::jsonb, false),
          ('div', '{"class": {"type": "string"}, "style": {"type": "string"}, "id": {"type": "string"}, "data-*": {"type": "string", "pattern": "data-.*"}}'::jsonb, false),
          ('span', '{"class": {"type": "string"}, "style": {"type": "string"}}'::jsonb, false),
          ('br', '{}'::jsonb, true),
          ('hr', '{"class": {"type": "string"}}'::jsonb, true),
          ('h1', '{"class": {"type": "string"}, "id": {"type": "string"}}'::jsonb, false),
          ('h2', '{"class": {"type": "string"}, "id": {"type": "string"}}'::jsonb, false),
          ('h3', '{"class": {"type": "string"}, "id": {"type": "string"}}'::jsonb, false),
          ('h4', '{"class": {"type": "string"}, "id": {"type": "string"}}'::jsonb, false),
          ('h5', '{"class": {"type": "string"}, "id": {"type": "string"}}'::jsonb, false),
          ('h6', '{"class": {"type": "string"}, "id": {"type": "string"}}'::jsonb, false),
          ('strong', '{}'::jsonb, false),
          ('b', '{}'::jsonb, false),
          ('em', '{}'::jsonb, false),
          ('i', '{}'::jsonb, false),
          ('u', '{}'::jsonb, false),
          ('s', '{}'::jsonb, false),
          ('strike', '{}'::jsonb, false),
          ('sup', '{}'::jsonb, false),
          ('sub', '{}'::jsonb, false),
          ('ul', '{"class": {"type": "string"}}'::jsonb, false),
          ('ol', '{"class": {"type": "string"}, "start": {"type": "number"}}'::jsonb, false),
          ('li', '{"class": {"type": "string"}}'::jsonb, false),
          ('a', '{"href": {"type": "string", "required": true}, "target": {"type": "string", "enum": ["_blank", "_self", "_parent", "_top"]}, "rel": {"type": "string"}, "class": {"type": "string"}}'::jsonb, false),
          ('img', '{"src": {"type": "string", "required": true}, "alt": {"type": "string", "required": true}, "width": {"type": "string"}, "height": {"type": "string"}, "class": {"type": "string"}}'::jsonb, true),
          ('blockquote', '{"class": {"type": "string"}, "cite": {"type": "string"}}'::jsonb, false),
          ('code', '{"class": {"type": "string"}}'::jsonb, false),
          ('pre', '{"class": {"type": "string"}}'::jsonb, false),
          ('table', '{"class": {"type": "string"}, "border": {"type": "string"}}'::jsonb, false),
          ('thead', '{}'::jsonb, false),
          ('tbody', '{}'::jsonb, false),
          ('tfoot', '{}'::jsonb, false),
          ('tr', '{"class": {"type": "string"}}'::jsonb, false),
          ('td', '{"class": {"type": "string"}, "colspan": {"type": "number"}, "rowspan": {"type": "number"}}'::jsonb, false),
          ('th', '{"class": {"type": "string"}, "colspan": {"type": "number"}, "rowspan": {"type": "number"}, "scope": {"type": "string"}}'::jsonb, false),
          ('caption', '{"class": {"type": "string"}}'::jsonb, false)
      ) AS tag(tag_name, attributes, is_void)
      WHERE ts."isDefault" = true OR ts."isPreset" = true;
    `);
  },

  down: async (queryInterface, Sequelize) => {
    // Remove indexes
    await queryInterface.removeIndex('TinymceAllowedTags', 'idx_allowed_tags_name');
    await queryInterface.removeIndex('TinymceAllowedTags', 'idx_allowed_tags_profile');
    
    // Remove constraint
    await queryInterface.removeConstraint('TinymceAllowedTags', 'unique_profile_tag');
    
    // Drop table
    await queryInterface.dropTable('TinymceAllowedTags');
  }
};
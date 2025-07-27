'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('TinymceFeatureFlags', {
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
      feature_name: {
        type: Sequelize.STRING(100),
        allowNull: false,
        validate: {
          isIn: [['pagebreak', 'spellcheck', 'autosave', 'wordcount', 'accessibility', 'templates', 'quickbars', 
                  'powerpaste', 'linkchecker', 'imagetools', 'mentions', 'mediaembed', 'formatpainter',
                  'permanentpen', 'toc', 'emoticons', 'checklist', 'casechange', 'export', 'pageembed']]
        }
      },
      enabled: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
        allowNull: false
      },
      config: {
        type: Sequelize.JSONB,
        defaultValue: {},
        allowNull: false,
        comment: 'Feature-specific configuration options'
      }
    });

    // Add unique constraint on profile_id + feature_name
    await queryInterface.addConstraint('TinymceFeatureFlags', {
      fields: ['profile_id', 'feature_name'],
      type: 'unique',
      name: 'unique_profile_feature'
    });

    // Add indexes for performance
    await queryInterface.addIndex('TinymceFeatureFlags', ['profile_id'], {
      name: 'idx_feature_flags_profile'
    });

    await queryInterface.addIndex('TinymceFeatureFlags', ['feature_name'], {
      name: 'idx_feature_flags_name'
    });

    await queryInterface.addIndex('TinymceFeatureFlags', ['enabled'], {
      name: 'idx_feature_flags_enabled'
    });

    // Insert default feature flags for existing profiles
    // ALWAYS enable pagebreak for all profiles
    await queryInterface.sequelize.query(`
      INSERT INTO "TinymceFeatureFlags" (id, profile_id, feature_name, enabled, config)
      SELECT 
        gen_random_uuid(),
        ts.id,
        feature.name,
        feature.enabled,
        feature.config
      FROM "TinymceSettings" ts
      CROSS JOIN (
        VALUES 
          ('pagebreak', true, '{"separator": "<!-- pagebreak -->", "split_block": true}'::jsonb),
          ('spellcheck', true, '{"language": "en_US", "spellchecker_languages": "English=en,Spanish=es,French=fr,German=de"}'::jsonb),
          ('autosave', true, '{"interval": 30, "retention": "20m", "restore_when_empty": false}'::jsonb),
          ('wordcount', true, '{"countSpaces": false, "countHTML": false}'::jsonb),
          ('accessibility', true, '{"level": "AA", "alt_text_warning": true}'::jsonb),
          ('templates', false, '{}'::jsonb),
          ('quickbars', true, '{"quickbars_selection_toolbar": "bold italic | quicklink h2 h3 blockquote", "quickbars_insert_toolbar": "quickimage quicktable"}'::jsonb)
      ) AS feature(name, enabled, config);
    `);

    // Ensure pagebreak is ALWAYS enabled by adding a trigger
    await queryInterface.sequelize.query(`
      CREATE OR REPLACE FUNCTION ensure_pagebreak_enabled()
      RETURNS TRIGGER AS $$
      BEGIN
        IF NEW.feature_name = 'pagebreak' AND NEW.enabled = false THEN
          RAISE EXCEPTION 'Pagebreak feature must always be enabled';
        END IF;
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;

      CREATE TRIGGER enforce_pagebreak_enabled
      BEFORE INSERT OR UPDATE ON "TinymceFeatureFlags"
      FOR EACH ROW
      EXECUTE FUNCTION ensure_pagebreak_enabled();
    `);
  },

  down: async (queryInterface, Sequelize) => {
    // Remove trigger and function
    await queryInterface.sequelize.query('DROP TRIGGER IF EXISTS enforce_pagebreak_enabled ON "TinymceFeatureFlags";');
    await queryInterface.sequelize.query('DROP FUNCTION IF EXISTS ensure_pagebreak_enabled();');
    
    // Remove indexes
    await queryInterface.removeIndex('TinymceFeatureFlags', 'idx_feature_flags_enabled');
    await queryInterface.removeIndex('TinymceFeatureFlags', 'idx_feature_flags_name');
    await queryInterface.removeIndex('TinymceFeatureFlags', 'idx_feature_flags_profile');
    
    // Remove constraint
    await queryInterface.removeConstraint('TinymceFeatureFlags', 'unique_profile_feature');
    
    // Drop table
    await queryInterface.dropTable('TinymceFeatureFlags');
  }
};
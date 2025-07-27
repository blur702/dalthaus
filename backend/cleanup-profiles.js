require('dotenv').config();
const sequelize = require('./src/config/database');
const TinymceSettings = require('./src/models/tinymceSettings.model');

async function cleanupProfiles() {
  try {
    // Connect to database
    await sequelize.authenticate();
    console.log('Database connection established successfully');

    // Find all profiles that are NOT locked and NOT system profiles
    const profilesToDelete = await TinymceSettings.findAll({
      where: {
        isLocked: false,
        profileType: {
          [sequelize.Sequelize.Op.ne]: 'system'
        }
      }
    });

    console.log(`Found ${profilesToDelete.length} profiles to delete:`);
    
    for (const profile of profilesToDelete) {
      console.log(`- ${profile.name} (type: ${profile.profileType}, preset: ${profile.isPreset})`);
    }

    if (profilesToDelete.length === 0) {
      console.log('No profiles to delete.');
      process.exit(0);
    }

    // Confirm before deletion
    console.log('\nDeleting these profiles...');

    // Delete the profiles
    const result = await TinymceSettings.destroy({
      where: {
        isLocked: false,
        profileType: {
          [sequelize.Sequelize.Op.ne]: 'system'
        }
      }
    });

    console.log(`\nSuccessfully deleted ${result} profiles.`);

    // Show remaining profiles
    const remainingProfiles = await TinymceSettings.findAll({
      attributes: ['name', 'profileType', 'isLocked', 'isPreset'],
      order: [['name', 'ASC']]
    });

    console.log('\nRemaining profiles:');
    for (const profile of remainingProfiles) {
      const flags = [];
      if (profile.isLocked) flags.push('LOCKED');
      if (profile.profileType === 'system') flags.push('SYSTEM');
      if (profile.isPreset) flags.push('PRESET');
      console.log(`- ${profile.name} [${flags.join(', ')}]`);
    }

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

cleanupProfiles();
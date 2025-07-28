const { Template } = require('../src/database').models;

async function resetGlobalSettings() {
  try {
    console.log('Resetting global template settings...');
    
    // Delete existing global settings
    await Template.destroy({
      where: {
        type: 'global_settings'
      }
    });
    
    console.log('✅ Old global settings removed');
    console.log('✅ New global settings will be created with updated defaults on next access');
    console.log('\nNew defaults include:');
    console.log('- Dark gray text (#141414) for all text elements');
    console.log('- Very light gray background (#f8f8f8)');
    console.log('- Arimo font for headings (Google Font substitute for Arial)');
    console.log('- Gelasio font for body text (Google Font substitute for Georgia)');
    console.log('- No accent colors - all links in dark gray');
    console.log('\nPlease access the Global Template Settings page to create the new defaults.');
    
    process.exit(0);
  } catch (error) {
    console.error('Error resetting global settings:', error);
    process.exit(1);
  }
}

resetGlobalSettings();
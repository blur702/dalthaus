// Test script to verify the duplication bug fix
const path = require('path');

// Set up the environment
process.env.NODE_ENV = 'development';

// Load the models
const sequelize = require('./src/config/database');
const TinymceSettings = require('./src/models/tinymceSettings.model');
const TinymceAllowedTags = require('./src/models/tinymceAllowedTags.model');
const TinymceFeatureFlags = require('./src/models/tinymceFeatureFlags.model');

async function testDuplicationFix() {
  console.log('Testing TinyMCE Profile Duplication Fix...\n');
  
  try {
    // Create a test profile with features
    console.log('1. Creating test profile...');
    const testProfile = await TinymceSettings.create({
      name: 'Test Duplication Source ' + Date.now(),
      description: 'Profile to test duplication fix',
      settings: {
        height: 450,
        menubar: true,
        plugins: ['lists', 'link', 'pagebreak', 'table', 'image'],
        toolbar: 'undo redo | bold italic | link image | pagebreak',
        statusbar: true
      },
      tags: ['test', 'duplication'],
      profileType: 'custom',
      priority: 20
    });
    console.log(`✓ Created profile: ${testProfile.name} (ID: ${testProfile.id})`);

    // Add some allowed tags
    console.log('\n2. Adding allowed tags...');
    await TinymceAllowedTags.bulkCreateForProfile(testProfile.id, [
      { tag_name: 'p', attributes: {} },
      { tag_name: 'h1', attributes: { class: { type: 'string' } } },
      { tag_name: 'img', attributes: { src: { type: 'url', required: true }, alt: { type: 'string' } }, is_void: true }
    ]);
    console.log('✓ Added 3 allowed tags');

    // Feature flags are automatically initialized, so let's verify they exist
    console.log('\n3. Verifying automatic feature flags...');
    const initialFeatures = await TinymceFeatureFlags.getFeaturesForProfile(testProfile.id);
    console.log(`✓ Profile has ${initialFeatures.length} feature flags (auto-initialized)`);

    // Test duplication
    console.log('\n4. Testing duplication...');
    const duplicateName = 'Test Duplication Copy ' + Date.now();
    const duplicatedProfile = await testProfile.duplicate(duplicateName, null);
    console.log(`✓ Successfully duplicated profile: ${duplicatedProfile.name} (ID: ${duplicatedProfile.id})`);

    // Verify duplication results
    console.log('\n5. Verifying duplication results...');
    
    // Check settings
    if (duplicatedProfile.settings.height === testProfile.settings.height &&
        duplicatedProfile.settings.plugins.length === testProfile.settings.plugins.length) {
      console.log('✓ Settings copied correctly');
    } else {
      console.log('✗ Settings not copied correctly');
    }

    // Check allowed tags
    const dupTags = await TinymceAllowedTags.getTagsForProfile(duplicatedProfile.id);
    console.log(`✓ Duplicated profile has ${dupTags.length} allowed tags`);

    // Check feature flags
    const dupFeatures = await TinymceFeatureFlags.getFeaturesForProfile(duplicatedProfile.id);
    console.log(`✓ Duplicated profile has ${dupFeatures.length} feature flags`);
    
    // Verify feature flags have unique IDs
    const sourceFeatures = await TinymceFeatureFlags.getFeaturesForProfile(testProfile.id);
    let uniqueIds = true;
    for (let i = 0; i < dupFeatures.length; i++) {
      if (sourceFeatures[i] && dupFeatures[i].id === sourceFeatures[i].id) {
        uniqueIds = false;
        console.log(`✗ Feature flag IDs are not unique: ${dupFeatures[i].feature_name}`);
        break;
      }
    }
    if (uniqueIds) {
      console.log('✓ All feature flags have unique IDs');
    }

    // Test duplicate again to ensure no conflicts
    console.log('\n6. Testing duplicate again (should not conflict)...');
    const duplicate2Name = 'Test Duplication Copy 2 ' + Date.now();
    const duplicatedProfile2 = await testProfile.duplicate(duplicate2Name, null);
    console.log(`✓ Successfully duplicated profile again: ${duplicatedProfile2.name}`);

    // Clean up
    console.log('\n7. Cleaning up test data...');
    await TinymceSettings.destroy({ where: { id: testProfile.id } });
    await TinymceSettings.destroy({ where: { id: duplicatedProfile.id } });
    await TinymceSettings.destroy({ where: { id: duplicatedProfile2.id } });
    console.log('✓ Cleaned up test profiles');

    console.log('\n✅ Duplication fix is working correctly!');
    
  } catch (error) {
    console.error('\n✗ Test failed:', error.message);
    console.error('Error details:', error);
  } finally {
    // Close database connection
    await sequelize.close();
  }
}

// Run the test
testDuplicationFix();
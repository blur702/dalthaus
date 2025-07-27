const axios = require('axios');
const fs = require('fs');
const path = require('path');

const API_BASE_URL = 'http://localhost:5001/api';
let authToken = '';

// Test credentials
const credentials = {
  username: 'admin',
  password: '(130Bpm)'
};

// Helper function to make authenticated requests
const makeRequest = async (method, endpoint, data = null) => {
  try {
    const config = {
      method,
      url: `${API_BASE_URL}${endpoint}`,
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json'
      }
    };

    if (data) {
      config.data = data;
    }

    const response = await axios(config);
    return response.data;
  } catch (error) {
    console.error(`Error in ${method} ${endpoint}:`, error.response?.data || error.message);
    throw error;
  }
};

// Test 1: Verify TinyMCE files are locally served
async function testTinymceFilesServed() {
  console.log('\n1. Testing TinyMCE Files Are Locally Served...');
  
  const tinymcePath = path.join(__dirname, '../frontend/public/tinymce');
  const requiredFiles = [
    'tinymce.min.js',
    'themes/silver/theme.min.js',
    'skins/ui/oxide/skin.min.css',
    'skins/content/default/content.min.css',
    'plugins/pagebreak/plugin.min.js',
    'plugins/lists/plugin.min.js',
    'plugins/link/plugin.min.js',
    'plugins/image/plugin.min.js'
  ];

  let allFilesPresent = true;
  for (const file of requiredFiles) {
    const filePath = path.join(tinymcePath, file);
    if (fs.existsSync(filePath)) {
      console.log(`✓ Found: ${file}`);
    } else {
      console.log(`✗ Missing: ${file}`);
      allFilesPresent = false;
    }
  }

  return allFilesPresent;
}

// Test 2: Login
async function testLogin() {
  console.log('\n2. Testing Login...');
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/login`, credentials);
    authToken = response.data.token;
    console.log('✓ Login successful');
    return true;
  } catch (error) {
    console.error('✗ Login failed:', error.response?.data || error.message);
    return false;
  }
}

// Test 3: Test Profile Selection
async function testProfileSelection() {
  console.log('\n3. Testing Profile Selection...');
  try {
    // Get all profiles
    const profiles = await makeRequest('GET', '/tinymce/profiles');
    console.log(`✓ Retrieved ${profiles.length} profiles`);
    
    // Test selecting each profile's configuration
    for (const profile of profiles) {
      try {
        const config = await makeRequest('GET', `/tinymce/profiles/${profile.id}/config`);
        console.log(`✓ Selected config for profile: ${profile.name}`);
        
        // Verify the config has required properties
        if (config.toolbar && config.plugins && config.height !== undefined) {
          console.log(`  - Toolbar: ${config.toolbar.substring(0, 50)}...`);
          console.log(`  - Plugins: ${config.plugins}`);
          console.log(`  - Height: ${config.height}`);
        } else {
          console.log(`  ✗ Invalid config structure for ${profile.name}`);
          return false;
        }
      } catch (error) {
        console.log(`  ✗ Failed to get config for ${profile.name}`);
        return false;
      }
    }
    
    return true;
  } catch (error) {
    console.error('✗ Profile selection test failed');
    return false;
  }
}

// Test 4: Test Profile Editing
async function testProfileEditing() {
  console.log('\n4. Testing Profile Editing...');
  try {
    // Create a test profile
    const newProfile = {
      name: 'Test Edit Profile ' + Date.now(),
      description: 'Profile for testing editing',
      settings: {
        height: 300,
        menubar: true,
        plugins: ['lists', 'link', 'pagebreak'],
        toolbar: 'undo redo | bold italic'
      },
      tags: ['test'],
      profileType: 'custom',
      priority: 15
    };

    const created = await makeRequest('POST', '/tinymce/profiles', newProfile);
    console.log(`✓ Created test profile: ${created.name}`);

    // Edit the profile
    const updates = {
      description: 'Updated description',
      settings: {
        height: 500,
        menubar: false,
        plugins: ['lists', 'link', 'pagebreak', 'image'],
        toolbar: 'undo redo | bold italic | link image'
      },
      priority: 25
    };

    const updated = await makeRequest('PUT', `/tinymce/profiles/${created.id}`, updates);
    console.log(`✓ Updated profile successfully`);
    console.log(`  - New height: ${updated.settings.height}`);
    console.log(`  - New description: ${updated.description}`);
    console.log(`  - New priority: ${updated.priority}`);

    // Update allowed tags
    const tags = [
      { tag_name: 'p', attributes: {} },
      { tag_name: 'strong', attributes: {} },
      { tag_name: 'em', attributes: {} }
    ];
    await makeRequest('PUT', `/tinymce/profiles/${created.id}/allowed-tags`, { tags });
    console.log(`✓ Updated allowed tags`);

    // Update features
    const features = [
      { feature_name: 'pagebreak', enabled: true },
      { feature_name: 'wordcount', enabled: true }
    ];
    await makeRequest('PUT', `/tinymce/profiles/${created.id}/features`, { features });
    console.log(`✓ Updated features`);

    // Clean up
    await makeRequest('DELETE', `/tinymce/profiles/${created.id}`);
    console.log(`✓ Cleaned up test profile`);

    return true;
  } catch (error) {
    console.error('✗ Profile editing test failed');
    return false;
  }
}

// Test 5: Test Profile Duplication
async function testProfileDuplication() {
  console.log('\n5. Testing Profile Duplication...');
  try {
    // Create a source profile
    const sourceProfile = {
      name: 'Source Profile ' + Date.now(),
      description: 'Profile to duplicate',
      settings: {
        height: 400,
        menubar: true,
        plugins: ['lists', 'link', 'pagebreak', 'table'],
        toolbar: 'undo redo | formatselect | bold italic'
      },
      tags: ['source', 'test'],
      profileType: 'custom',
      priority: 30
    };

    const source = await makeRequest('POST', '/tinymce/profiles', sourceProfile);
    console.log(`✓ Created source profile: ${source.name}`);

    // Add allowed tags to source
    const tags = [
      { tag_name: 'h1', attributes: {} },
      { tag_name: 'h2', attributes: {} }
    ];
    await makeRequest('PUT', `/tinymce/profiles/${source.id}/allowed-tags`, { tags });

    // Duplicate the profile
    const duplicateName = 'Duplicated Profile ' + Date.now();
    const duplicated = await makeRequest('POST', `/tinymce/profiles/${source.id}/duplicate`, {
      name: duplicateName
    });
    console.log(`✓ Duplicated profile: ${duplicated.name}`);
    
    // Verify duplication
    if (duplicated.settings.height === source.settings.height &&
        duplicated.settings.plugins.length === source.settings.plugins.length) {
      console.log(`✓ Settings copied correctly`);
    } else {
      console.log(`✗ Settings not copied correctly`);
      return false;
    }

    // Get allowed tags for duplicated profile
    const dupTags = await makeRequest('GET', `/tinymce/profiles/${duplicated.id}/allowed-tags`);
    console.log(`✓ Duplicated profile has ${dupTags.length} allowed tags`);

    // Clean up
    await makeRequest('DELETE', `/tinymce/profiles/${source.id}`);
    await makeRequest('DELETE', `/tinymce/profiles/${duplicated.id}`);
    console.log(`✓ Cleaned up test profiles`);

    return true;
  } catch (error) {
    console.error('✗ Profile duplication test failed:', error.message);
    return false;
  }
}

// Test 6: Test Adding New Profiles
async function testAddingProfiles() {
  console.log('\n6. Testing Adding New Profiles...');
  try {
    const testProfiles = [
      {
        name: 'Minimal Editor ' + Date.now(),
        description: 'Minimal configuration',
        settings: {
          height: 200,
          menubar: false,
          plugins: ['pagebreak'],
          toolbar: 'undo redo | bold italic',
          statusbar: false
        },
        profileType: 'custom',
        priority: 5
      },
      {
        name: 'Advanced Editor ' + Date.now(),
        description: 'Advanced configuration',
        settings: {
          height: 600,
          menubar: true,
          plugins: ['advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 
                   'preview', 'anchor', 'searchreplace', 'visualblocks', 'code', 
                   'fullscreen', 'insertdatetime', 'media', 'table', 'wordcount', 'pagebreak'],
          toolbar: 'undo redo | blocks | bold italic forecolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image media | pagebreak | removeformat | code',
          statusbar: true
        },
        profileType: 'custom',
        priority: 50
      }
    ];

    const createdProfiles = [];
    for (const profile of testProfiles) {
      const created = await makeRequest('POST', '/tinymce/profiles', profile);
      createdProfiles.push(created);
      console.log(`✓ Created profile: ${created.name}`);
      console.log(`  - Height: ${created.settings.height}`);
      console.log(`  - Plugins count: ${created.settings.plugins.length}`);
    }

    // Clean up
    for (const profile of createdProfiles) {
      await makeRequest('DELETE', `/tinymce/profiles/${profile.id}`);
    }
    console.log(`✓ Cleaned up ${createdProfiles.length} test profiles`);

    return true;
  } catch (error) {
    console.error('✗ Adding profiles test failed');
    return false;
  }
}

// Test 7: Test Lock Functionality
async function testLockFunctionality() {
  console.log('\n7. Testing Lock Functionality...');
  try {
    // Get locked profiles
    const profiles = await makeRequest('GET', '/tinymce/profiles');
    const lockedProfiles = profiles.filter(p => p.isLocked);
    
    if (lockedProfiles.length > 0) {
      console.log(`✓ Found ${lockedProfiles.length} locked profiles`);
      
      // Try to edit a locked profile (should fail)
      const lockedProfile = lockedProfiles[0];
      console.log(`  Testing locked profile: ${lockedProfile.name}`);
      
      try {
        await makeRequest('PUT', `/tinymce/profiles/${lockedProfile.id}`, {
          description: 'Trying to edit locked profile'
        });
        console.log(`  ✗ Was able to edit locked profile (should have failed)`);
        return false;
      } catch (error) {
        if (error.response?.status === 403 || error.response?.data?.error?.includes('locked')) {
          console.log(`  ✓ Correctly prevented editing locked profile`);
        } else {
          console.log(`  ✗ Unexpected error when editing locked profile`);
          return false;
        }
      }
      
      // Try to delete a locked profile (should fail)
      try {
        await makeRequest('DELETE', `/tinymce/profiles/${lockedProfile.id}`);
        console.log(`  ✗ Was able to delete locked profile (should have failed)`);
        return false;
      } catch (error) {
        if (error.response?.status === 403 || error.response?.data?.error?.includes('locked')) {
          console.log(`  ✓ Correctly prevented deleting locked profile`);
        } else {
          console.log(`  ✗ Unexpected error when deleting locked profile`);
          return false;
        }
      }
    } else {
      console.log(`! No locked profiles found to test`);
      // This is not a failure, just means we can't test lock functionality
    }
    
    return true;
  } catch (error) {
    console.error('✗ Lock functionality test failed');
    return false;
  }
}

// Test 8: Integration Test - Full Workflow
async function testIntegrationWorkflow() {
  console.log('\n8. Testing Integration Workflow...');
  try {
    // 1. Create a profile with all features
    const profile = {
      name: 'Integration Test Profile ' + Date.now(),
      description: 'Full integration test',
      settings: {
        height: 450,
        menubar: true,
        plugins: ['lists', 'link', 'image', 'pagebreak', 'table', 'code'],
        toolbar: 'undo redo | blocks | bold italic | alignleft aligncenter | bullist numlist | link image | pagebreak | code',
        statusbar: true,
        branding: false
      },
      tags: ['integration', 'test'],
      profileType: 'custom',
      priority: 35,
      isDefault: false
    };

    const created = await makeRequest('POST', '/tinymce/profiles', profile);
    console.log(`✓ Created integration test profile`);

    // 2. Set allowed tags
    const allowedTags = [
      { tag_name: 'p', attributes: { class: { type: 'string' } } },
      { tag_name: 'h1', attributes: { id: { type: 'string' } } },
      { tag_name: 'h2', attributes: { id: { type: 'string' } } },
      { tag_name: 'a', attributes: { href: { type: 'url', required: true }, target: { type: 'string' } } },
      { tag_name: 'img', attributes: { src: { type: 'url', required: true }, alt: { type: 'string' } }, is_void: true },
      { tag_name: 'div', attributes: { class: { type: 'string' } } }
    ];
    await makeRequest('PUT', `/tinymce/profiles/${created.id}/allowed-tags`, { tags: allowedTags });
    console.log(`✓ Set ${allowedTags.length} allowed tags`);

    // 3. Set features
    const features = [
      { feature_name: 'pagebreak', enabled: true },
      { feature_name: 'wordcount', enabled: true },
      { feature_name: 'spellcheck', enabled: true },
      { feature_name: 'autosave', enabled: false }
    ];
    await makeRequest('PUT', `/tinymce/profiles/${created.id}/features`, { features });
    console.log(`✓ Set ${features.length} features`);

    // 4. Get compiled configuration
    const compiledConfig = await makeRequest('GET', `/tinymce/profiles/${created.id}/config`);
    console.log(`✓ Retrieved compiled configuration`);
    
    // Verify compiled config includes everything
    if (compiledConfig.plugins.includes('pagebreak') && 
        compiledConfig.toolbar.includes('pagebreak') &&
        compiledConfig.height === 450) {
      console.log(`✓ Compiled config is correct`);
    } else {
      console.log(`✗ Compiled config is missing expected values`);
      return false;
    }

    // 5. Duplicate the profile
    const dupName = 'Integration Duplicate ' + Date.now();
    const duplicated = await makeRequest('POST', `/tinymce/profiles/${created.id}/duplicate`, { name: dupName });
    console.log(`✓ Duplicated profile successfully`);

    // 6. Verify duplicate has same configuration
    const dupConfig = await makeRequest('GET', `/tinymce/profiles/${duplicated.id}/config`);
    if (dupConfig.height === compiledConfig.height &&
        dupConfig.plugins.length === compiledConfig.plugins.length) {
      console.log(`✓ Duplicate has correct configuration`);
    } else {
      console.log(`✗ Duplicate configuration doesn't match`);
      return false;
    }

    // 7. Clean up
    await makeRequest('DELETE', `/tinymce/profiles/${created.id}`);
    await makeRequest('DELETE', `/tinymce/profiles/${duplicated.id}`);
    console.log(`✓ Cleaned up test profiles`);

    return true;
  } catch (error) {
    console.error('✗ Integration workflow test failed:', error.message);
    return false;
  }
}

// Run all tests
async function runTests() {
  console.log('Starting Comprehensive TinyMCE Tests...');
  console.log('=====================================');

  const tests = [
    { name: 'TinyMCE Files Served', fn: testTinymceFilesServed },
    { name: 'Login', fn: testLogin },
    { name: 'Profile Selection', fn: testProfileSelection },
    { name: 'Profile Editing', fn: testProfileEditing },
    { name: 'Profile Duplication', fn: testProfileDuplication },
    { name: 'Adding Profiles', fn: testAddingProfiles },
    { name: 'Lock Functionality', fn: testLockFunctionality },
    { name: 'Integration Workflow', fn: testIntegrationWorkflow }
  ];

  let passed = 0;
  let failed = 0;

  for (const test of tests) {
    try {
      const result = await test.fn();
      if (result) {
        passed++;
      } else {
        failed++;
      }
    } catch (error) {
      console.error(`✗ ${test.name} test threw an error:`, error.message);
      failed++;
    }
  }

  console.log('\n=====================================');
  console.log(`Tests completed: ${passed} passed, ${failed} failed`);
  console.log('=====================================');
  
  if (failed === 0) {
    console.log('\n✅ All tests passed! TinyMCE is properly configured.');
  } else {
    console.log('\n❌ Some tests failed. Please check the errors above.');
  }
}

// Check if axios is installed
try {
  require.resolve('axios');
  runTests();
} catch(e) {
  console.log('Installing axios for testing...');
  const { execSync } = require('child_process');
  execSync('npm install axios', { cwd: __dirname, stdio: 'inherit' });
  console.log('Axios installed. Please run this script again.');
}
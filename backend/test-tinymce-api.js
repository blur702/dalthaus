const axios = require('axios');

const API_BASE_URL = 'http://localhost:5001/api';
let authToken = '';
let testProfileId = '';

// Test credentials (using the seeded admin user)
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

// Test functions
async function testLogin() {
  console.log('\n1. Testing Login...');
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

async function testGetProfiles() {
  console.log('\n2. Testing GET /tinymce/profiles...');
  try {
    const profiles = await makeRequest('GET', '/tinymce/profiles');
    console.log(`✓ Retrieved ${profiles.length} profiles`);
    profiles.forEach(p => console.log(`   - ${p.name} (${p.profileType})`));
    return true;
  } catch (error) {
    console.error('✗ Failed to get profiles');
    return false;
  }
}

async function testCreateProfile() {
  console.log('\n3. Testing POST /tinymce/profiles...');
  try {
    const newProfile = {
      name: 'Test Profile',
      description: 'A test profile created via API',
      settings: {
        height: 400,
        menubar: false,
        plugins: ['lists', 'link', 'pagebreak'],
        toolbar: 'undo redo | bold italic | bullist numlist | link'
      },
      tags: ['test', 'api'],
      profileType: 'custom',
      priority: 10
    };

    const profile = await makeRequest('POST', '/tinymce/profiles', newProfile);
    testProfileId = profile.id;
    console.log(`✓ Created profile: ${profile.name} (ID: ${profile.id})`);
    return true;
  } catch (error) {
    console.error('✗ Failed to create profile');
    return false;
  }
}

async function testGetProfile() {
  console.log('\n4. Testing GET /tinymce/profiles/:id...');
  try {
    const profile = await makeRequest('GET', `/tinymce/profiles/${testProfileId}`);
    console.log(`✓ Retrieved profile: ${profile.name}`);
    console.log(`   - Description: ${profile.description}`);
    console.log(`   - Plugins: ${profile.settings.plugins.join(', ')}`);
    return true;
  } catch (error) {
    console.error('✗ Failed to get profile');
    return false;
  }
}

async function testUpdateProfile() {
  console.log('\n5. Testing PUT /tinymce/profiles/:id...');
  try {
    const updates = {
      description: 'Updated test profile description',
      priority: 20
    };

    const profile = await makeRequest('PUT', `/tinymce/profiles/${testProfileId}`, updates);
    console.log(`✓ Updated profile: ${profile.name}`);
    console.log(`   - New description: ${profile.description}`);
    console.log(`   - New priority: ${profile.priority}`);
    return true;
  } catch (error) {
    console.error('✗ Failed to update profile');
    return false;
  }
}

async function testGetCompiledConfig() {
  console.log('\n6. Testing GET /tinymce/profiles/:id/config...');
  try {
    const config = await makeRequest('GET', `/tinymce/profiles/${testProfileId}/config`);
    console.log('✓ Retrieved compiled configuration');
    console.log(`   - Height: ${config.height}`);
    console.log(`   - Plugins: ${config.plugins.join(', ')}`);
    console.log(`   - Toolbar: ${config.toolbar}`);
    return true;
  } catch (error) {
    console.error('✗ Failed to get compiled config');
    return false;
  }
}

async function testToolbarPresets() {
  console.log('\n7. Testing GET /tinymce/toolbar-presets...');
  try {
    const presets = await makeRequest('GET', '/tinymce/toolbar-presets');
    console.log(`✓ Retrieved ${presets.length} toolbar presets`);
    presets.forEach(p => console.log(`   - ${p.name} (System: ${p.is_system})`));
    return true;
  } catch (error) {
    console.error('✗ Failed to get toolbar presets');
    return false;
  }
}

async function testAllowedTags() {
  console.log('\n8. Testing Allowed Tags endpoints...');
  try {
    // Update allowed tags
    const tags = [
      { tag_name: 'p', attributes: { class: { type: 'string' } } },
      { tag_name: 'h1', attributes: { id: { type: 'string' } } },
      { tag_name: 'img', attributes: { src: { type: 'url', required: true }, alt: { type: 'string' } }, is_void: true }
    ];

    await makeRequest('PUT', `/tinymce/profiles/${testProfileId}/allowed-tags`, { tags });
    console.log('✓ Updated allowed tags');

    // Get allowed tags
    const allowedTags = await makeRequest('GET', `/tinymce/profiles/${testProfileId}/allowed-tags`);
    console.log(`✓ Retrieved ${allowedTags.length} allowed tags`);
    allowedTags.forEach(t => console.log(`   - <${t.tag_name}> (Void: ${t.is_void})`));
    return true;
  } catch (error) {
    console.error('✗ Failed in allowed tags test');
    return false;
  }
}

async function testFeatureFlags() {
  console.log('\n9. Testing Feature Flags endpoints...');
  try {
    // Update feature flags
    const features = [
      { feature_name: 'wordcount', enabled: true, config: { countSpaces: true } },
      { feature_name: 'autosave', enabled: true, config: { interval: 60 } },
      { feature_name: 'spellcheck', enabled: false }
    ];

    await makeRequest('PUT', `/tinymce/profiles/${testProfileId}/features`, { features });
    console.log('✓ Updated feature flags');

    // Get feature flags
    const featureFlags = await makeRequest('GET', `/tinymce/profiles/${testProfileId}/features`);
    console.log(`✓ Retrieved ${featureFlags.length} feature flags`);
    featureFlags.forEach(f => console.log(`   - ${f.feature_name}: ${f.enabled ? 'Enabled' : 'Disabled'}`));
    return true;
  } catch (error) {
    console.error('✗ Failed in feature flags test');
    return false;
  }
}

async function testDuplicateProfile() {
  console.log('\n10. Testing POST /tinymce/profiles/:id/duplicate...');
  try {
    const duplicatedProfile = await makeRequest('POST', `/tinymce/profiles/${testProfileId}/duplicate`, {
      name: 'Test Profile (Copy)'
    });
    console.log(`✓ Duplicated profile: ${duplicatedProfile.name} (ID: ${duplicatedProfile.id})`);
    
    // Clean up - delete the duplicated profile
    await makeRequest('DELETE', `/tinymce/profiles/${duplicatedProfile.id}`);
    console.log('✓ Cleaned up duplicated profile');
    return true;
  } catch (error) {
    console.error('✗ Failed to duplicate profile');
    return false;
  }
}

async function testDeleteProfile() {
  console.log('\n11. Testing DELETE /tinymce/profiles/:id...');
  try {
    await makeRequest('DELETE', `/tinymce/profiles/${testProfileId}`);
    console.log('✓ Deleted test profile');
    return true;
  } catch (error) {
    console.error('✗ Failed to delete profile');
    return false;
  }
}

// Run all tests
async function runTests() {
  console.log('Starting TinyMCE API Tests...');
  console.log('==============================');

  const tests = [
    testLogin,
    testGetProfiles,
    testCreateProfile,
    testGetProfile,
    testUpdateProfile,
    testGetCompiledConfig,
    testToolbarPresets,
    testAllowedTags,
    testFeatureFlags,
    testDuplicateProfile,
    testDeleteProfile
  ];

  let passed = 0;
  let failed = 0;

  for (const test of tests) {
    const result = await test();
    if (result) {
      passed++;
    } else {
      failed++;
    }
  }

  console.log('\n==============================');
  console.log(`Tests completed: ${passed} passed, ${failed} failed`);
  console.log('==============================');
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
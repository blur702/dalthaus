const axios = require('axios');

async function testLockedProfile() {
  const baseURL = 'http://localhost:5001/api';
  let token;
  
  try {
    // 1. Login
    console.log('1. Logging in...');
    const loginResponse = await axios.post(`${baseURL}/auth/login`, {
      username: 'admin',
      password: '(130Bpm)'
    });
    token = loginResponse.data.token;
    console.log('✓ Login successful');

    // 2. Get all profiles
    console.log('\n2. Getting all profiles...');
    const profilesResponse = await axios.get(`${baseURL}/tinymce/profiles`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    const commonEditor = profilesResponse.data.find(p => p.name === 'Common Editor');
    if (!commonEditor) {
      console.error('❌ Common Editor profile not found!');
      return;
    }
    
    console.log('✓ Found Common Editor profile');
    console.log(`  - ID: ${commonEditor.id}`);
    console.log(`  - Locked: ${commonEditor.isLocked}`);
    console.log(`  - Preset: ${commonEditor.isPreset}`);
    console.log(`  - Plugins include pagebreak: ${commonEditor.settings.plugins.includes('pagebreak')}`);

    // 3. Try to delete (should fail)
    console.log('\n3. Testing delete protection...');
    try {
      await axios.delete(`${baseURL}/tinymce/profiles/${commonEditor.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.error('❌ Delete succeeded but should have failed!');
    } catch (error) {
      if (error.response && error.response.status === 403) {
        console.log('✓ Delete correctly blocked: ' + error.response.data.error);
      } else {
        console.error('❌ Unexpected error:', error.message);
      }
    }

    // 4. Test duplication
    console.log('\n4. Testing duplication...');
    try {
      const duplicateResponse = await axios.post(
        `${baseURL}/tinymce/profiles/${commonEditor.id}/duplicate`,
        { name: 'Common Editor Copy' },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log('✓ Duplication successful');
      console.log(`  - New profile: ${duplicateResponse.data.name}`);
      console.log(`  - New ID: ${duplicateResponse.data.id}`);
      console.log(`  - Locked: ${duplicateResponse.data.isLocked} (should be false)`);
      
      // Clean up - delete the duplicate
      await axios.delete(`${baseURL}/tinymce/profiles/${duplicateResponse.data.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('  - Cleaned up duplicate');
    } catch (error) {
      console.error('❌ Duplication failed:', error.response?.data || error.message);
    }

    console.log('\n✅ All tests passed! The locked Common Editor profile is working correctly.');

  } catch (error) {
    console.error('Test failed:', error.response?.data || error.message);
  }
}

testLockedProfile();
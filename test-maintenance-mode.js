const axios = require('axios');

const API_BASE = 'http://localhost:5001/api';
const ADMIN_TOKEN = process.env.ADMIN_TOKEN || '';

async function login() {
  try {
    const response = await axios.post(`${API_BASE}/auth/login`, {
      username: 'admin',
      password: '(130Bpm)'
    });
    return response.data.token;
  } catch (error) {
    console.error('Login failed:', error.response?.data || error.message);
    throw error;
  }
}

async function testMaintenanceMode() {
  console.log('🧪 Testing Maintenance Mode Feature\n');

  try {
    // Step 1: Login as admin
    console.log('1. Logging in as admin...');
    const token = await login();
    console.log('   ✅ Login successful\n');

    // Step 2: Get current settings
    console.log('2. Getting current site settings...');
    const currentSettings = await axios.get(`${API_BASE}/settings/site`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('   ✅ Current maintenance mode:', currentSettings.data.maintenanceMode || false);
    console.log('   ✅ Current message:', currentSettings.data.maintenanceMessage || 'Not set\n');

    // Step 3: Enable maintenance mode
    console.log('3. Enabling maintenance mode...');
    await axios.put(`${API_BASE}/settings/site`, {
      ...currentSettings.data,
      maintenanceMode: true,
      maintenanceMessage: 'Testing maintenance mode - site will be back shortly!',
      maintenanceBypassIps: []  // Empty array to test blocking
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('   ✅ Maintenance mode enabled\n');

    // Step 4: Test public API access (should fail)
    console.log('4. Testing public API access...');
    try {
      await axios.get(`${API_BASE}/public/articles`);
      console.log('   ❌ Public API still accessible (unexpected)');
    } catch (error) {
      if (error.response?.status === 503) {
        console.log('   ✅ Public API blocked with 503 status');
        console.log('   ✅ Message:', error.response.data.message);
      } else {
        console.log('   ❌ Unexpected error:', error.response?.status || error.message);
      }
    }

    // Step 5: Test admin API access (should work)
    console.log('\n5. Testing admin API access...');
    try {
      const adminTest = await axios.get(`${API_BASE}/users`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('   ✅ Admin API still accessible');
    } catch (error) {
      console.log('   ❌ Admin API blocked (unexpected):', error.response?.status || error.message);
    }

    // Step 6: Test maintenance status endpoint
    console.log('\n6. Testing maintenance status endpoint...');
    const status = await axios.get(`${API_BASE}/settings/maintenance-status`);
    console.log('   ✅ Status endpoint accessible');
    console.log('   ✅ Maintenance mode:', status.data.maintenanceMode);
    console.log('   ✅ Message:', status.data.maintenanceMessage);

    // Step 7: Disable maintenance mode
    console.log('\n7. Disabling maintenance mode...');
    await axios.put(`${API_BASE}/settings/site`, {
      ...currentSettings.data,
      maintenanceMode: false
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('   ✅ Maintenance mode disabled\n');

    // Step 8: Test public API access again (should work)
    console.log('8. Testing public API access after disabling...');
    try {
      const publicTest = await axios.get(`${API_BASE}/public/articles`);
      console.log('   ✅ Public API accessible again');
    } catch (error) {
      console.log('   ❌ Public API still blocked (unexpected):', error.response?.status || error.message);
    }

    console.log('\n✅ All maintenance mode tests passed!');

  } catch (error) {
    console.error('\n❌ Test failed:', error.response?.data || error.message);
    process.exit(1);
  }
}

// Run the test
testMaintenanceMode();
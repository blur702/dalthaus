const axios = require('axios');

const API_BASE = 'http://localhost:5001/api';

async function testLoginDuringMaintenance() {
  console.log('🧪 Testing Login During Maintenance Mode\n');

  try {
    // Step 1: First login to get admin token
    console.log('1. Initial login as admin...');
    let response = await axios.post(`${API_BASE}/auth/login`, {
      username: 'admin',
      password: '(130Bpm)'
    });
    const token = response.data.token;
    console.log('   ✅ Initial login successful\n');

    // Step 2: Enable maintenance mode
    console.log('2. Enabling maintenance mode...');
    const settingsResponse = await axios.get(`${API_BASE}/settings/site`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    await axios.put(`${API_BASE}/settings/site`, {
      ...settingsResponse.data,
      maintenanceMode: true,
      maintenanceMessage: 'Testing login during maintenance'
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('   ✅ Maintenance mode enabled\n');

    // Step 3: Test login while in maintenance mode (without token)
    console.log('3. Testing login during maintenance mode...');
    try {
      response = await axios.post(`${API_BASE}/auth/login`, {
        username: 'admin',
        password: '(130Bpm)'
      });
      console.log('   ✅ Login successful during maintenance mode');
      console.log('   Token received:', response.data.token ? 'Yes' : 'No');
    } catch (error) {
      console.log('   ❌ Login failed during maintenance mode');
      console.log('   Error:', error.response?.status, error.response?.data);
    }

    // Step 4: Test accessing admin endpoints with the new token
    console.log('\n4. Testing admin access during maintenance...');
    if (response?.data?.token) {
      try {
        const usersResponse = await axios.get(`${API_BASE}/users`, {
          headers: { Authorization: `Bearer ${response.data.token}` }
        });
        console.log('   ✅ Admin endpoints accessible during maintenance');
      } catch (error) {
        console.log('   ❌ Admin endpoints blocked:', error.response?.status);
      }
    }

    // Step 5: Disable maintenance mode
    console.log('\n5. Disabling maintenance mode...');
    await axios.put(`${API_BASE}/settings/site`, {
      ...settingsResponse.data,
      maintenanceMode: false
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('   ✅ Maintenance mode disabled');

    console.log('\n✅ Login during maintenance test completed!');

  } catch (error) {
    console.error('\n❌ Test failed:', error.response?.data || error.message);
    if (error.response?.status === 500) {
      console.error('Server error - check backend logs for details');
    }
  }
}

testLoginDuringMaintenance();
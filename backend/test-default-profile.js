const axios = require('axios');

const API_BASE = 'http://localhost:5001/api';
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI5YTc3NWRjMy1iNjc4LTQ1ODEtYTY0My04NDgyNTZhNGIyMzMiLCJyb2xlIjoic3VwZXJ1c2VyIiwiaWF0IjoxNzM3NTU1NjgxfQ.6nPvUcp_7w-eFqxR6oB-vJQ6aeajqETYczc9gqmXhUA';

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Authorization': `Bearer ${token}`
  }
});

async function testDefaultProfile() {
  try {
    console.log('1. Testing GET /tinymce/default-profile...');
    const getResponse = await api.get('/tinymce/default-profile');
    console.log('Current default profile:', getResponse.data);

    // Get the Common Editor profile ID
    console.log('\n2. Getting Common Editor profile...');
    const profilesResponse = await api.get('/tinymce/profiles');
    const commonEditor = profilesResponse.data.find(p => p.name === 'Common Editor');
    
    if (!commonEditor) {
      throw new Error('Common Editor profile not found');
    }
    
    console.log('Common Editor profile ID:', commonEditor.id);

    console.log('\n3. Setting Common Editor as default profile...');
    const setResponse = await api.put('/tinymce/default-profile', {
      profileId: commonEditor.id
    });
    console.log('Response:', setResponse.data);

    console.log('\n4. Verifying default profile was set...');
    const verifyResponse = await api.get('/tinymce/default-profile');
    console.log('New default profile:', verifyResponse.data);
    console.log('Success! Default profile ID matches:', verifyResponse.data.profileId === commonEditor.id);

  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
  }
}

testDefaultProfile();
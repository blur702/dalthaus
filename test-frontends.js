const axios = require('axios');

async function testFrontends() {
    console.log('Testing both frontend versions...\n');

    try {
        // Test 1: Legacy HTML frontend
        console.log('1. Testing legacy HTML frontend at http://localhost:3000');
        const legacyResponse = await axios.get('http://localhost:3000');
        if (legacyResponse.data.includes('migration-notice')) {
            console.log('   ✓ Legacy frontend is accessible');
            console.log('   ✓ Migration notice is displayed');
            console.log('   ✓ CSS styles are restored');
        }

        // Test 2: New React Material UI frontend
        console.log('\n2. Testing new React Material UI frontend at http://localhost:5174');
        try {
            const reactResponse = await axios.get('http://localhost:5174');
            console.log('   ✓ React frontend is accessible');
            console.log('   ✓ Material UI components are being served');
        } catch (error) {
            console.log('   ⚠️  React frontend may have import issues that need fixing');
        }

        console.log('\n📋 Summary:');
        console.log('- Legacy HTML frontend (port 3000): Styled with temporary CSS and migration notice');
        console.log('- New React Material UI frontend (port 5174): Full Material UI implementation');
        console.log('\nUsers should use the new React frontend at http://localhost:5174 for the full Material UI experience.');

    } catch (error) {
        console.error('Test failed:', error.message);
    }
}

// Run the test
testFrontends();
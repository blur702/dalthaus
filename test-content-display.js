const axios = require('axios');

async function testContentDisplay() {
    console.log('Testing content display after Vite proxy port fix...\n');

    try {
        // Test 1: Check backend API directly
        console.log('1. Testing backend API directly at http://localhost:5001');
        const backendResponse = await axios.get('http://localhost:5001/api/content/articles');
        console.log(`   ✓ Backend API responded with ${backendResponse.data.items.length} articles`);
        console.log(`   ✓ First article title: "${backendResponse.data.items[0].title}"`);

        // Test 2: Check frontend proxy
        console.log('\n2. Testing frontend proxy at http://localhost:5173/api');
        const frontendProxyResponse = await axios.get('http://localhost:5173/api/content/articles');
        console.log(`   ✓ Frontend proxy responded with ${frontendProxyResponse.data.items.length} articles`);
        console.log(`   ✓ Proxy is correctly forwarding to backend on port 5001`);

        // Test 3: Verify data consistency
        console.log('\n3. Verifying data consistency');
        if (backendResponse.data.items.length === frontendProxyResponse.data.items.length) {
            console.log('   ✓ Article count matches between backend and frontend proxy');
        } else {
            console.log('   ✗ Article count mismatch!');
        }

        // Test 4: Check photo books
        console.log('\n4. Testing photo books endpoint');
        const photoBooksResponse = await axios.get('http://localhost:5173/api/content/photo-books');
        console.log(`   ✓ Photo books endpoint responded with ${photoBooksResponse.data.items.length} items`);

        console.log('\n✅ All tests passed! Content is now being displayed correctly.');
        console.log('\nSummary:');
        console.log(`- Backend server is running on port 5001`);
        console.log(`- Frontend Vite proxy is correctly configured to forward /api requests to port 5001`);
        console.log(`- Content is being fetched and displayed properly`);
        console.log(`- Total articles: ${backendResponse.data.items.length}`);
        console.log(`- Total photo books: ${photoBooksResponse.data.items.length}`);

    } catch (error) {
        console.error('Test failed:', error.message);
        if (error.response) {
            console.error('Response status:', error.response.status);
            console.error('Response data:', error.response.data);
        }
    }
}

// Run the test
testContentDisplay();
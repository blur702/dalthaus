// Using built-in fetch (Node.js 18+)

const API_BASE = 'http://localhost:5001/api';
const PUBLIC_API = 'http://localhost:5001/api/public';

// Test credentials
const credentials = {
  username: 'admin',
  password: '(130Bpm)'
};

async function testCoverImageFunctionality() {
  console.log('🧪 Testing Cover Image Functionality...\n');

  try {
    // Step 1: Login
    console.log('1. Logging in...');
    const loginResponse = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    });

    if (!loginResponse.ok) {
      throw new Error('Failed to login');
    }

    const { token } = await loginResponse.json();
    console.log('✅ Logged in successfully');

    const authHeaders = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };

    // Step 2: Create a test article with cover image
    console.log('\n2. Creating test article with cover image...');
    const testArticle = {
      title: 'Test Article with Cover Image',
      body: '<p>This is a test article to verify cover image functionality.</p>',
      coverImageUrl: 'https://via.placeholder.com/400x300?text=Cover+Image',
      status: 'published'
    };

    const createResponse = await fetch(`${API_BASE}/content/articles`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify(testArticle)
    });

    if (!createResponse.ok) {
      const error = await createResponse.text();
      throw new Error(`Failed to create article: ${error}`);
    }

    const { content: createdArticle } = await createResponse.json();
    console.log('✅ Created article:', createdArticle.title);
    console.log('   Cover Image URL:', createdArticle.coverImageUrl);

    // Step 3: Fetch article from public API
    console.log('\n3. Fetching article from public API...');
    const publicResponse = await fetch(`${PUBLIC_API}/articles`);
    const publicData = await publicResponse.json();
    
    const testArticleFromPublic = publicData.articles.find(a => a.id === createdArticle.id);
    
    if (testArticleFromPublic && testArticleFromPublic.coverImageUrl) {
      console.log('✅ Article found in public API with cover image');
      console.log('   Cover Image URL:', testArticleFromPublic.coverImageUrl);
    } else {
      console.log('❌ Article not found in public API or missing cover image');
    }

    // Step 4: Test photobook with cover image
    console.log('\n4. Creating test photobook with cover image...');
    const testPhotobook = {
      title: 'Test Photobook with Cover',
      body: '<p>This is a test photobook.</p>',
      coverImageUrl: 'https://via.placeholder.com/500x400?text=Photobook+Cover',
      status: 'published'
    };

    const photobookResponse = await fetch(`${API_BASE}/content/photobooks`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify(testPhotobook)
    });

    if (!photobookResponse.ok) {
      const error = await photobookResponse.text();
      throw new Error(`Failed to create photobook: ${error}`);
    }

    const { content: createdPhotobook } = await photobookResponse.json();
    console.log('✅ Created photobook:', createdPhotobook.title);
    console.log('   Cover Image URL:', createdPhotobook.coverImageUrl);

    // Step 5: Fetch photobook from public API
    console.log('\n5. Fetching photobook from public API...');
    const photobookPublicResponse = await fetch(`${PUBLIC_API}/photobooks`);
    const photobookPublicData = await photobookPublicResponse.json();
    
    const testPhotobookFromPublic = photobookPublicData.photoBooks.find(p => p.id === createdPhotobook.id);
    
    if (testPhotobookFromPublic && testPhotobookFromPublic.coverImageUrl) {
      console.log('✅ Photobook found in public API with cover image');
      console.log('   Cover Image URL:', testPhotobookFromPublic.coverImageUrl);
    } else {
      console.log('❌ Photobook not found in public API or missing cover image');
    }

    // Step 6: Clean up - delete test content
    console.log('\n6. Cleaning up test content...');
    
    await fetch(`${API_BASE}/content/articles/${createdArticle.id}`, {
      method: 'DELETE',
      headers: authHeaders
    });
    
    await fetch(`${API_BASE}/content/photobooks/${createdPhotobook.id}`, {
      method: 'DELETE',
      headers: authHeaders
    });
    
    console.log('✅ Test content cleaned up');

    console.log('\n🎉 Cover Image functionality test completed successfully!');
    console.log('\nNext steps:');
    console.log('- Go to http://localhost:5173/admin to create content with cover images');
    console.log('- Go to http://localhost:3001 to view the public frontend');
    console.log('- Cover images will appear in article and photobook listings');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    process.exit(1);
  }
}

testCoverImageFunctionality();
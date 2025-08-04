// Create test content with cover images
const API_BASE = 'http://localhost:5001/api';

async function createTestContent() {
  console.log('🧪 Creating test content with cover images...\n');

  try {
    // Step 1: Login
    console.log('1. Logging in...');
    const loginResponse = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: 'admin',
        password: '(130Bpm)'
      })
    });

    const { token } = await loginResponse.json();
    console.log('✅ Logged in successfully');

    const authHeaders = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };

    // Step 2: Create test articles with cover images
    console.log('\n2. Creating test articles with cover images...');
    
    const testArticles = [
      {
        title: 'Photography Tips for Beginners',
        body: '<p>Learn the basics of photography with these essential tips for beginners.</p>',
        coverImageUrl: 'https://via.placeholder.com/400x300/4CAF50/ffffff?text=Photography+Tips',
        status: 'published'
      },
      {
        title: 'Advanced Camera Techniques',
        body: '<p>Master advanced camera techniques to take your photography to the next level.</p>',
        coverImageUrl: 'https://via.placeholder.com/400x300/2196F3/ffffff?text=Advanced+Camera',
        status: 'published'
      },
      {
        title: 'Portrait Photography Guide',
        body: '<p>A comprehensive guide to taking stunning portrait photographs.</p>',
        coverImageUrl: 'https://via.placeholder.com/400x300/FF9800/ffffff?text=Portrait+Guide',
        status: 'published'
      }
    ];

    for (const article of testArticles) {
      const response = await fetch(`${API_BASE}/content/articles`, {
        method: 'POST',
        headers: authHeaders,
        body: JSON.stringify(article)
      });
      
      if (response.ok) {
        console.log(`✅ Created article: ${article.title}`);
      } else {
        console.log(`❌ Failed to create article: ${article.title}`);
      }
    }

    // Step 3: Create test photobooks with cover images
    console.log('\n3. Creating test photobooks with cover images...');
    
    const testPhotobooks = [
      {
        title: 'Street Photography Collection',
        body: '<p>A stunning collection of street photography from around the world.</p>',
        coverImageUrl: 'https://via.placeholder.com/500x400/9C27B0/ffffff?text=Street+Photography',
        status: 'published'
      },
      {
        title: 'Nature & Wildlife Album',
        body: '<p>Beautiful captures of nature and wildlife in their natural habitat.</p>',
        coverImageUrl: 'https://via.placeholder.com/500x400/4CAF50/ffffff?text=Nature+Wildlife',
        status: 'published'
      }
    ];

    for (const photobook of testPhotobooks) {
      const response = await fetch(`${API_BASE}/content/photobooks`, {
        method: 'POST',
        headers: authHeaders,
        body: JSON.stringify(photobook)
      });
      
      if (response.ok) {
        console.log(`✅ Created photobook: ${photobook.title}`);
      } else {
        console.log(`❌ Failed to create photobook: ${photobook.title}`);
      }
    }

    console.log('\n🎉 Test content created successfully!');
    console.log('\nYou can now:');
    console.log('1. Visit http://localhost:5173/admin to see the content in admin');
    console.log('2. Visit http://localhost:3001 to see cover images on public frontend');
    console.log('3. Test the API at http://localhost:5001/api/public/articles');

  } catch (error) {
    console.error('❌ Failed to create test content:', error.message);
  }
}

createTestContent();
const { Article, PhotoBook } = require('./src/models/content');
const sequelize = require('./src/config/database');

async function testFeaturedImage() {
  try {
    // Create a test article with featured image
    const article = await Article.create({
      title: 'Test Article with Featured Image',
      slug: 'test-article-featured-image',
      body: '<p>This is a test article to verify featured image functionality.</p>',
      featuredImage: '/images/test-article-featured.jpg',
      status: 'published',
      authorId: '00000000-0000-0000-0000-000000000001' // Assuming a default user exists
    });
    
    console.log('Created article with featured image:', {
      id: article.id,
      title: article.title,
      featuredImage: article.featuredImage
    });
    
    // Create a test photobook with featured image
    const photoBook = await PhotoBook.create({
      title: 'Test PhotoBook with Featured Image',
      slug: 'test-photobook-featured-image',
      body: '<p>This is a test photobook to verify featured image functionality.</p>',
      featuredImage: '/images/test-photobook-featured.jpg',
      status: 'published',
      authorId: '00000000-0000-0000-0000-000000000001'
    });
    
    console.log('Created photobook with featured image:', {
      id: photoBook.id,
      title: photoBook.title,
      featuredImage: photoBook.featuredImage
    });
    
    // Fetch and verify
    const fetchedArticle = await Article.findByPk(article.id);
    const fetchedPhotoBook = await PhotoBook.findByPk(photoBook.id);
    
    console.log('\nVerification:');
    console.log('Article has featuredImage:', !!fetchedArticle.featuredImage);
    console.log('PhotoBook has featuredImage:', !!fetchedPhotoBook.featuredImage);
    
    // Test API endpoints
    const apiTest = await fetch('http://localhost:5001/api/public/articles?limit=1');
    const apiData = await apiTest.json();
    console.log('\nAPI Response includes featuredImage:', 
      apiData.articles && apiData.articles.length > 0 && 'featuredImage' in apiData.articles[0]
    );
    
  } catch (error) {
    console.error('Test failed:', error);
  } finally {
    await sequelize.close();
  }
}

testFeaturedImage();
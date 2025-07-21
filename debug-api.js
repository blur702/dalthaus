// Debug API endpoints
const { Article, PhotoBook, Page } = require('./backend/src/models/content');

async function debugAPI() {
  try {
    console.log('Testing Article model...');
    const articles = await Article.findAll({
      where: { status: 'published' },
      attributes: ['id', 'title', 'slug', 'body', 'coverImageUrl', 'publishedAt', 'metadata'],
      limit: 5
    });
    console.log(`Found ${articles.length} articles`);
    
    if (articles.length > 0) {
      console.log('Sample article:', {
        id: articles[0].id,
        title: articles[0].title,
        coverImageUrl: articles[0].coverImageUrl
      });
    }
    
    console.log('\nTesting PhotoBook model...');
    const photoBooks = await PhotoBook.findAll({
      where: { status: 'published' },
      attributes: ['id', 'title', 'slug', 'body', 'coverImageUrl', 'publishedAt', 'metadata'],
      limit: 5
    });
    console.log(`Found ${photoBooks.length} photobooks`);
    
    if (photoBooks.length > 0) {
      console.log('Sample photobook:', {
        id: photoBooks[0].id,
        title: photoBooks[0].title,
        coverImageUrl: photoBooks[0].coverImageUrl
      });
    }
    
  } catch (error) {
    console.error('Error:', error.message);
  }
  
  process.exit(0);
}

debugAPI();
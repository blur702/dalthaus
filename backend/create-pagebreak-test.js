const Article = require('./src/models/content/article.model');
const User = require('./src/models/user.model');

async function createTestArticle() {
  try {
    // Get admin user
    const adminUser = await User.findOne({ where: { username: 'admin' } });
    if (!adminUser) {
      console.error('Admin user not found');
      return;
    }
    
    const testContent = `
<h1>Page 1 - Introduction</h1>
<p>This is the first page of our test article. It contains some introductory content.</p>
<p>We'll add a pagebreak after this paragraph to test the functionality.</p>
<!-- pagebreak -->
<h2>Page 2 - Main Content</h2>
<p>This is the second page. The content viewer should display this on a separate page.</p>
<p>Let's add some more content here to make it substantial.</p>
<ul>
  <li>Item 1</li>
  <li>Item 2</li>
  <li>Item 3</li>
</ul>
<!-- pagebreak -->
<h2>Page 3 - Conclusion</h2>
<p>This is the third and final page of our test article.</p>
<p>If the pagebreak functionality is working correctly, you should see pagination controls.</p>
`;

    const article = await Article.create({
      title: 'Pagebreak Test Article',
      slug: 'pagebreak-test-article',
      body: testContent.trim(),
      summary: 'Testing pagebreak functionality with a multi-page article',
      status: 'published',
      contentType: 'article',
      featuredImage: null,
      featuredImageAlt: null,
      authorId: adminUser.id
    });

    console.log('Created test article:', article.title);
    console.log('Slug:', article.slug);
    console.log('Number of pagebreaks:', (article.body.match(/<!-- pagebreak -->/g) || []).length);
    
  } catch (error) {
    console.error('Error creating article:', error.message);
  }
  
  process.exit(0);
}

createTestArticle();
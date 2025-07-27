const { sequelize } = require('./src/config/database');
const Article = require('./src/models/content/article.model');

async function checkPagebreakContent() {
  try {
    // Get the most recent article
    const article = await Article.findOne({
      order: [['createdAt', 'DESC']],
      attributes: ['id', 'title', 'body', 'slug']
    });

    if (!article) {
      console.log('No articles found');
      return;
    }

    console.log('\n=== Article Analysis ===');
    console.log('Title:', article.title);
    console.log('Slug:', article.slug);
    console.log('\n--- Body Content ---');
    console.log(article.body.substring(0, 500) + '...');
    
    // Check for different pagebreak formats
    console.log('\n--- Pagebreak Detection ---');
    const hasCommentPagebreak = article.body.includes('<!-- pagebreak -->');
    const hasMcePagebreak = article.body.includes('mce-pagebreak');
    const hasPagebreakDiv = article.body.includes('class="pagebreak"');
    
    console.log('Has <!-- pagebreak -->:', hasCommentPagebreak);
    console.log('Has mce-pagebreak:', hasMcePagebreak);
    console.log('Has pagebreak div:', hasPagebreakDiv);
    
    // Count pagebreaks
    const pagebreakCount = (article.body.match(/<!-- pagebreak -->/g) || []).length;
    console.log('Total pagebreak comments:', pagebreakCount);
    
    // Show all pagebreak occurrences with context
    if (pagebreakCount > 0) {
      console.log('\n--- Pagebreak Contexts ---');
      const parts = article.body.split('<!-- pagebreak -->');
      parts.forEach((part, index) => {
        if (index < parts.length - 1) {
          const endContext = part.slice(-100);
          const startContext = parts[index + 1].slice(0, 100);
          console.log(`\nPagebreak ${index + 1}:`);
          console.log('Before: ...', endContext.replace(/\n/g, ' '));
          console.log('After:', startContext.replace(/\n/g, ' '), '...');
        }
      });
    }
    
    // Look for any TinyMCE pagebreak representations
    console.log('\n--- Raw HTML Search ---');
    const imgMatches = article.body.match(/<img[^>]*class="[^"]*mce-pagebreak[^"]*"[^>]*>/g);
    if (imgMatches) {
      console.log('Found mce-pagebreak images:', imgMatches.length);
      imgMatches.forEach((match, i) => console.log(`${i + 1}:`, match));
    }
    
    const divMatches = article.body.match(/<div[^>]*class="[^"]*pagebreak[^"]*"[^>]*>[\s\S]*?<\/div>/g);
    if (divMatches) {
      console.log('\nFound pagebreak divs:', divMatches.length);
      divMatches.forEach((match, i) => console.log(`${i + 1}:`, match.substring(0, 100) + '...'));
    }

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await sequelize.close();
  }
}

checkPagebreakContent();
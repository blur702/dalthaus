const { Article, User } = require('../src/database').models;

async function createSampleArticles() {
  try {
    // Find admin user
    const admin = await User.findOne({ where: { username: 'admin' } });
    if (!admin) {
      console.error('Admin user not found');
      return;
    }

    const articles = [
      {
        title: 'The Art of Black and White Photography',
        slug: 'art-of-black-and-white-photography',
        summary: 'Discover the timeless appeal of monochrome imagery and learn techniques for creating compelling black and white photographs.',
        body: '<p>Black and white photography strips away the distraction of color to reveal the essence of a subject. It emphasizes texture, form, light, and shadow in ways that color photography cannot.</p><p>When shooting in black and white, pay special attention to contrast and tonal range. Look for scenes with strong light and shadow interplay, interesting textures, and compelling shapes.</p>',
        status: 'published',
        authorId: admin.id,
        publishedAt: new Date()
      },
      {
        title: 'Capturing Natural Light: A Guide',
        slug: 'capturing-natural-light-guide',
        summary: 'Master the use of natural light in your photography with these essential tips and techniques.',
        body: '<p>Natural light is one of the most powerful tools in a photographer\'s arsenal. Understanding how to work with different types of natural light can transform your images from ordinary to extraordinary.</p><p>The quality of natural light changes throughout the day. Morning light is soft and warm, midday light is harsh and direct, while evening light brings golden tones and long shadows.</p>',
        status: 'published',
        authorId: admin.id,
        publishedAt: new Date(Date.now() - 24 * 60 * 60 * 1000) // 1 day ago
      },
      {
        title: 'Street Photography: Finding Stories',
        slug: 'street-photography-finding-stories',
        summary: 'Learn how to capture compelling narratives in the urban landscape through street photography.',
        body: '<p>Street photography is about observing and capturing the human condition in public spaces. It\'s a genre that requires patience, quick reflexes, and an eye for the decisive moment.</p><p>The best street photographers are invisible observers, blending into the urban landscape while remaining alert to the stories unfolding around them.</p>',
        status: 'published',
        authorId: admin.id,
        publishedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) // 3 days ago
      },
      {
        title: 'The Golden Hour: Magic Light',
        slug: 'golden-hour-photography-magic-time',
        summary: 'Explore why photographers cherish the golden hour and how to make the most of this magical light.',
        body: '<p>The golden hour, that brief period after sunrise and before sunset, offers photographers the most flattering natural light. The low angle of the sun creates warm, soft light that enhances colors and creates long, dramatic shadows.</p><p>During golden hour, the light changes rapidly. Be prepared to work quickly and have your compositions planned in advance.</p>',
        status: 'published',
        authorId: admin.id,
        publishedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000) // 5 days ago
      },
      {
        title: 'Composition Rules That Work',
        slug: 'composition-rules-transform-photos',
        summary: 'Master the fundamental rules of composition to create more impactful photographs.',
        body: '<p>Good composition is the foundation of great photography. Understanding these basic rules will elevate your work and help you create more visually pleasing images.</p><p>The rule of thirds, leading lines, symmetry, and framing are just a few of the compositional tools at your disposal. Learn them, practice them, then break them creatively.</p>',
        status: 'published',
        authorId: admin.id,
        publishedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // 7 days ago
      },
      {
        title: 'Portrait Photography: Capturing Character',
        slug: 'portrait-photography-capturing-character',
        summary: 'Tips for creating portraits that reveal the essence of your subjects.',
        body: '<p>Great portrait photography goes beyond technical perfection. It\'s about connecting with your subject and capturing something of their essence, their character, their story.</p><p>The eyes are often called the windows to the soul. Focus on the eyes, ensure they\'re sharp, and look for that spark of life that makes a portrait compelling.</p>',
        status: 'published',
        authorId: admin.id,
        publishedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000) // 10 days ago
      },
      {
        title: 'Landscape Photography Essentials',
        slug: 'landscape-photography-essentials',
        summary: 'Essential techniques for capturing the beauty of the natural world.',
        body: '<p>Landscape photography is about more than just documenting a beautiful location. It\'s about conveying the feeling of being there, the atmosphere, the mood of the place.</p><p>Patience is key in landscape photography. Wait for the right light, the right weather, the right moment when all elements come together to create something special.</p>',
        status: 'published',
        authorId: admin.id,
        publishedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000) // 14 days ago
      }
    ];

    for (const articleData of articles) {
      const existing = await Article.findOne({ where: { slug: articleData.slug } });
      if (!existing) {
        await Article.create(articleData);
        console.log('✅ Created article:', articleData.title);
      } else {
        console.log('⏭️  Article already exists:', articleData.title);
      }
    }

    console.log('\n✨ Sample photography articles created successfully!');
  } catch (error) {
    console.error('Error creating articles:', error);
  }
  process.exit(0);
}

createSampleArticles();
const { Template } = require('../src/database').models;

async function createDefaultFrontPageTemplate() {
  try {
    console.log('Creating default front page template...');
    
    // Check if a front page template already exists
    const existingTemplate = await Template.findOne({
      where: {
        slug: 'default-front-page'
      }
    });
    
    if (existingTemplate) {
      console.log('Updating existing front page template...');
      await existingTemplate.destroy();
    }
    
    // Create the default front page template
    const frontPageTemplate = await Template.create({
      name: 'Default Front Page',
      slug: 'default-front-page',
      type: 'front_page',
      description: 'Clean, minimalist design focused on photography',
      isActive: true,
      isDefault: true,
      configuration: {
        // Site information
        siteTitle: 'Don Althaus',
        siteSubtitle: 'photography',
        missionTitle: "It's all about storytelling...",
        missionText: "Effective storytelling is the heart and soul of photography. It's what draws your readers in and it's what keeps your reader's attention. (And yes, they are readers...)",
        showMission: true,
        
        // Content settings
        articlesTitle: 'Getting up to speed with storytelling',
        photoBooksTitle: 'Photo Books',
        maxArticles: 3,
        maxPhotoBooks: 2,
        
        // Banner settings
        bannerImage: null,
        bannerHeight: 350,
        
        // Layout
        contentWidth: 'lg',
        layoutVariant: 'simple',
        headerAlignment: 'left',
        contentLayout: 'two-column',
        cardStyle: 'minimal'
      },
      globalSettings: {
        // Typography
        primaryFont: 'Arimo',  // Google Font substitute for Arial
        secondaryFont: 'Gelasio',  // Google Font substitute for Georgia
        baseFontSize: 16,
        fontScale: 1.25,
        headingWeight: 700,
        bodyWeight: 400,
        lineHeight: 1.15,  // 1.15 line height as specified
        letterSpacing: 0,
        paragraphSpacing: 0,  // 0 space above and below paragraphs
        
        // Colors
        primaryColor: '#141414',  // Dark gray for links/accents
        secondaryColor: '#141414',  // Dark gray
        textColor: '#141414',  // Dark gray RGB(20, 20, 20)
        backgroundColor: '#f8f8f8',  // Very light gray RGB(248, 248, 248)
        surfaceColor: '#ffffff',
        errorColor: '#f44336',
        warningColor: '#ff9800',
        infoColor: '#2196f3',
        successColor: '#4caf50',
        
        // Body Settings
        bodyBackgroundColor: '#f8f8f8',  // Very light gray RGB(248, 248, 248)
        bodyTextColor: '#141414',  // Dark gray RGB(20, 20, 20)
        bodyLinkColor: '#141414',  // Dark gray for links
        bodyLinkHoverColor: '#000000',  // Darker on hover
        
        // Text Colors
        headingColor: '#141414',  // Dark gray RGB(20, 20, 20)
        captionColor: '#141414',  // Dark gray RGB(20, 20, 20)
        
        // Heading Styles
        h1: { size: 2.5, weight: 700, lineHeight: 1.15, letterSpacing: -0.02, color: '#141414' },
        h2: { size: 2, weight: 700, lineHeight: 1.15, letterSpacing: -0.01, color: '#141414' },
        h3: { size: 1.75, weight: 600, lineHeight: 1.15, letterSpacing: 0, color: '#141414' },
        h4: { size: 1.5, weight: 600, lineHeight: 1.15, letterSpacing: 0, color: '#141414' },
        h5: { size: 1.25, weight: 500, lineHeight: 1.15, letterSpacing: 0, color: '#141414' },
        h6: { size: 1, weight: 500, lineHeight: 1.15, letterSpacing: 0, color: '#141414' },
        
        // Spacing
        containerMaxWidth: 1200,
        containerPadding: 24,
        sectionSpacing: 80,
        elementSpacing: 24,
        componentSpacing: 16,
        
        // Border & Effects
        borderRadius: 0,  // Flat design
        borderColor: '#e0e0e0',
        borderWidth: 1,
        boxShadow: 'none'  // No shadows for flat design
      },
      headerSettings: {
        headerVariant: 'simple',
        showNavigation: true,
        navPosition: 'below',
        showMission: true,
        height: 80,
        width: 100,
        widthUnit: '%',
        sticky: false,
        backgroundColor: '#f8f8f8',  // Same as body background
        backgroundImage: null,
        backgroundOpacity: 100,
        backgroundPosition: 'center',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        padding: { top: 20, bottom: 20, left: 20, right: 20 },
        boxShadow: 'none',
        borderBottom: '1px solid #e0e0e0'
      },
      footerSettings: {
        footerVariant: 'minimal',
        showContactInfo: false,
        showSocialLinks: false,
        height: 100,
        width: 100,
        widthUnit: '%',
        backgroundColor: '#f8f8f8',  // Same as body background
        backgroundImage: null,
        backgroundOpacity: 100,
        backgroundPosition: 'center',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        padding: { top: 40, bottom: 40, left: 20, right: 20 },
        textColor: '#141414',  // Dark gray
        linkColor: '#141414',  // Dark gray
        layout: 'centered',
        showNewsletter: false
      },
      layoutSettings: {
        contentWidth: 'lg',
        showSidebar: false,
        sidebarPosition: 'right'
      }
    });
    
    console.log('✅ Default front page template created successfully!');
    console.log('Template ID:', frontPageTemplate.id);
    console.log('\nSettings applied:');
    console.log('- Dark gray text (#141414) for all elements');
    console.log('- Very light gray background (#f8f8f8)');
    console.log('- Arimo font for headings');
    console.log('- Gelasio font for body text');
    console.log('- Line height: 1.15');
    console.log('- Paragraph spacing: 0');
    console.log('- Flat design (no shadows or accent colors)');
    console.log('- Simple, photography-focused layout');
    
    process.exit(0);
  } catch (error) {
    console.error('Error creating front page template:', error);
    process.exit(1);
  }
}

createDefaultFrontPageTemplate();
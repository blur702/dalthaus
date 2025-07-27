const { sequelize } = require('../src/config/database');
const { models } = require('../src/database');

const defaultTemplates = [
  {
    name: 'Classic Photography',
    slug: 'classic-photography',
    type: 'front_page',
    description: 'A clean, professional template for photography websites with a focus on visual storytelling',
    isDefault: true,
    isActive: true,
    configuration: {
      siteTitle: 'Don Althaus',
      siteSubtitle: 'photography',
      missionTitle: "It's all about storytelling...",
      missionText: "Effective storytelling is the heart and soul of photography. It's what draws your readers in and it's what keeps your reader's attention. (And yes, they are readers...)",
      showMission: true,
      primaryColor: '#2c3e50',
      backgroundColor: '#ffffff',
      textColor: '#333333',
      headerBgColor: '#f8f9fa',
      footerBgColor: '#2c3e50',
      fontFamily: 'Georgia, serif',
      fontSize: '16px',
      headingFont: 'Helvetica, Arial, sans-serif',
      containerPadding: '20px',
      sectionSpacing: '40px',
      elementSpacing: '20px'
    },
    headerSettings: {
      headerVariant: 'banner',
      showNavigation: true,
      navPosition: 'below',
      showMission: true
    },
    footerSettings: {
      footerVariant: 'detailed',
      showContactInfo: true,
      showSocialLinks: true
    },
    layoutSettings: {
      contentWidth: 'lg',
      showSidebar: false,
      sidebarPosition: 'right'
    }
  },
  {
    name: 'Modern Minimal',
    slug: 'modern-minimal',
    type: 'front_page',
    description: 'A minimalist template with clean lines and focus on content',
    isDefault: false,
    isActive: false,
    configuration: {
      siteTitle: 'Photography Portfolio',
      siteSubtitle: 'Visual Stories',
      missionTitle: 'Capturing Moments',
      missionText: 'Every photograph tells a story. Every moment has meaning.',
      showMission: true,
      primaryColor: '#000000',
      backgroundColor: '#fafafa',
      textColor: '#1a1a1a',
      headerBgColor: '#ffffff',
      footerBgColor: '#000000',
      fontFamily: 'Helvetica Neue, Arial, sans-serif',
      fontSize: '15px',
      headingFont: 'Futura, sans-serif',
      containerPadding: '30px',
      sectionSpacing: '60px',
      elementSpacing: '15px'
    },
    headerSettings: {
      headerVariant: 'minimal',
      showNavigation: true,
      navPosition: 'inline',
      showMission: false
    },
    footerSettings: {
      footerVariant: 'simple',
      showContactInfo: false,
      showSocialLinks: true
    },
    layoutSettings: {
      contentWidth: 'xl',
      showSidebar: false,
      sidebarPosition: 'right'
    }
  },
  {
    name: 'Gallery Focus',
    slug: 'gallery-focus',
    type: 'front_page',
    description: 'Designed for showcasing photo galleries with sidebar navigation',
    isDefault: false,
    isActive: false,
    configuration: {
      siteTitle: 'Photo Gallery',
      siteSubtitle: 'Professional Photography',
      missionTitle: 'Visual Excellence',
      missionText: 'Dedicated to capturing the extraordinary in the ordinary.',
      showMission: false,
      primaryColor: '#e74c3c',
      backgroundColor: '#f5f5f5',
      textColor: '#2c3e50',
      headerBgColor: '#34495e',
      footerBgColor: '#2c3e50',
      fontFamily: 'Roboto, sans-serif',
      fontSize: '16px',
      headingFont: 'Montserrat, sans-serif',
      containerPadding: '15px',
      sectionSpacing: '30px',
      elementSpacing: '10px'
    },
    headerSettings: {
      headerVariant: 'banner',
      showNavigation: true,
      navPosition: 'above',
      showMission: false
    },
    footerSettings: {
      footerVariant: 'detailed',
      showContactInfo: true,
      showSocialLinks: true
    },
    layoutSettings: {
      contentWidth: 'full',
      showSidebar: true,
      sidebarPosition: 'left'
    }
  }
];

async function seedDefaultTemplates() {
  try {
    console.log('Seeding default templates...');
    
    for (const templateData of defaultTemplates) {
      const [template, created] = await models.Template.findOrCreate({
        where: { slug: templateData.slug },
        defaults: templateData
      });
      
      if (created) {
        console.log(`Created template: ${templateData.name}`);
      } else {
        console.log(`Template already exists: ${templateData.name}`);
      }
    }
    
    console.log('Default templates seeding completed!');
  } catch (error) {
    console.error('Error seeding default templates:', error);
  } finally {
    await sequelize.close();
  }
}

// Run the seeder
seedDefaultTemplates();
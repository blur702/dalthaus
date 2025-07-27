import React from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  Divider,
  Link,
} from '@mui/material';
import TemplateHeader from './TemplateHeader';
import TemplateFooter from './TemplateFooter';

const ContentPageTemplate = ({ 
  templateData = {}, 
  contentData = {
    title: 'Lorem Ipsum Is The Best English Dummy Text Ever Devised In Latin',
    content: `
      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Euismod est urna, morbi amet, mauris faucibus. Ornare duis porttitor mauris mauris donec accumsan.</p>
      <p>Fusce felis ipsum purus, et sed. Amet, orci, molestie et turpis morbi nisl condimentum sagittis. Sagittis semper in laoreet sed commodo tempor nulla ut volutpat.</p>
      <p>Neque odio lacus, vitae imperdiet mauris velit nec. Sit odio ornare at malesuada mauris quam. Viverra sed feugiat viverra nunc, mauris molestie tortor, feugiat. Cursus duis egestas ut morbi in eleifend.</p>
    `,
    relatedArticles: [
      { id: 1, title: 'Telling the Subject\'s Story As Completely As Possible', slug: 'telling-subjects-story' },
      { id: 2, title: 'Your Smartphone Camera Is Perfect For Storytelling', slug: 'smartphone-storytelling' },
      { id: 3, title: 'Brief Read: The Organizing Questions', slug: 'organizing-questions' },
      { id: 4, title: 'Brief Read - The Practical Details', slug: 'practical-details' },
      { id: 5, title: 'The Practice Of Pure Photography', slug: 'pure-photography' },
      { id: 6, title: 'How I Learned To Stop Worrying And Love JPEG', slug: 'love-jpeg' },
      { id: 7, title: 'The Joy Of Getting It Right In The Camera', slug: 'getting-it-right' },
      { id: 8, title: 'Make Adjustment Easier On You And Your Subject', slug: 'make-adjustment-easier' },
      { id: 9, title: 'Fill in the blank (with my camera)', slug: 'fill-in-blank' },
      { id: 10, title: 'Route 66 - Still America\'s Mother Road', slug: 'route-66' },
      { id: 11, title: 'Boom and Bust Together', slug: 'boom-and-bust' },
      { id: 12, title: 'Arizona\'s Ghost Town Trail', slug: 'arizona-ghost-town' },
      { id: 13, title: 'The Anonymous Ghost Town', slug: 'anonymous-ghost-town' },
      { id: 14, title: 'A Year At The Mall', slug: 'year-at-mall' },
    ]
  }
}) => {
  const config = templateData.configuration || {};
  const headerSettings = templateData.headerSettings || {};
  const footerSettings = templateData.footerSettings || {};
  const layoutSettings = templateData.layoutSettings || {
    contentWidth: 'lg',
    showSidebar: true,
    sidebarPosition: 'right'
  };

  // Apply template styles
  const templateStyles = {
    backgroundColor: config.backgroundColor || '#ffffff',
    color: config.textColor || '#000000',
    fontFamily: config.fontFamily || 'sans-serif',
    fontSize: config.fontSize || '16px',
    minHeight: '100vh',
  };

  const contentStyles = {
    fontFamily: config.fontFamily || 'sans-serif',
    '& h1, & h2, & h3, & h4, & h5, & h6': {
      fontFamily: config.headingFont || config.fontFamily || 'sans-serif',
      color: config.headingColor || config.textColor || '#000000',
    },
    '& a': {
      color: config.primaryColor || '#0066cc',
      textDecoration: 'none',
      '&:hover': {
        textDecoration: 'underline',
      }
    }
  };

  return (
    <Box sx={templateStyles}>
      <TemplateHeader 
        templateData={templateData}
        variant="compact"
      />
      
      <Container 
        maxWidth={layoutSettings.contentWidth || 'lg'}
        sx={{ 
          py: config.sectionSpacing || 4,
          px: config.containerPadding || 3,
        }}
      >
        <Box 
          sx={{ 
            display: 'flex',
            gap: 4,
            flexDirection: layoutSettings.sidebarPosition === 'left' ? 'row-reverse' : 'row',
            '@media (max-width: 768px)': {
              flexDirection: 'column',
            }
          }}
        >
          {/* Main Content */}
          <Box 
            component="main"
            sx={{ 
              flex: layoutSettings.showSidebar ? 2 : 1,
              minWidth: 0,
            }}
          >
            <Paper 
              elevation={config.contentElevation || 0}
              sx={{ 
                p: config.contentPadding || 4,
                backgroundColor: config.contentBgColor || 'transparent',
                ...contentStyles,
              }}
            >
              <Typography 
                variant="h1" 
                component="h1"
                sx={{ 
                  fontSize: config.titleSize || '2.5rem',
                  mb: 3,
                  fontWeight: config.titleWeight || 600,
                }}
              >
                {contentData.title}
              </Typography>
              
              <Box 
                sx={{ 
                  '& p': { 
                    mb: 2,
                    lineHeight: config.lineHeight || 1.6,
                  },
                  '& img': { 
                    maxWidth: '100%', 
                    height: 'auto',
                    my: 2,
                  }
                }}
                dangerouslySetInnerHTML={{ __html: contentData.content }}
              />
            </Paper>
          </Box>

          {/* Contents Sidebar */}
          {layoutSettings.showSidebar && (
            <Box 
              component="aside"
              sx={{ 
                flex: 1,
                minWidth: 0,
                borderLeft: layoutSettings.sidebarPosition !== 'left' ? `1px solid ${config.borderColor || '#ccc'}` : 'none',
                borderRight: layoutSettings.sidebarPosition === 'left' ? `1px solid ${config.borderColor || '#ccc'}` : 'none',
                pl: layoutSettings.sidebarPosition !== 'left' ? 3 : 0,
                pr: layoutSettings.sidebarPosition === 'left' ? 3 : 0,
              }}
            >
              <Paper 
                elevation={config.sidebarElevation || 0}
                sx={{ 
                  p: config.sidebarPadding || 3,
                  backgroundColor: config.sidebarBgColor || 'transparent',
                  position: 'sticky',
                  top: 20,
                }}
              >
                <Typography 
                  variant="h5" 
                  component="h2"
                  sx={{ 
                    mb: 2,
                    fontSize: config.sidebarTitleSize || '1.25rem',
                    fontWeight: config.sidebarTitleWeight || 600,
                  }}
                >
                  {config.sidebarTitle || 'Contents'}
                </Typography>
                
                <List sx={{ p: 0 }}>
                  {contentData.relatedArticles.map((article, index) => (
                    <React.Fragment key={article.id}>
                      <ListItem 
                        sx={{ 
                          px: 0,
                          py: 1,
                          '&:hover': {
                            backgroundColor: config.sidebarHoverColor || 'rgba(0,0,0,0.04)',
                          }
                        }}
                      >
                        <ListItemText 
                          primary={
                            <Link 
                              href={`#${article.slug}`}
                              sx={{ 
                                color: config.sidebarLinkColor || config.primaryColor || '#0066cc',
                                fontSize: config.sidebarLinkSize || '0.95rem',
                              }}
                            >
                              {article.title}
                            </Link>
                          }
                        />
                      </ListItem>
                      {index < contentData.relatedArticles.length - 1 && (
                        <Divider sx={{ opacity: 0.3 }} />
                      )}
                    </React.Fragment>
                  ))}
                </List>
              </Paper>
            </Box>
          )}
        </Box>
      </Container>

      <TemplateFooter 
        templateData={templateData}
      />
    </Box>
  );
};

export default ContentPageTemplate;
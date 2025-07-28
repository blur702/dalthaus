import React from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  useTheme,
  Grid,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useSiteSettings } from '../contexts/SiteSettingsContext';

// Hard-coded template settings
const TEMPLATE_CONFIG = {
  // Site information
  siteTitle: 'Don Althaus',
  siteSubtitle: 'photography',
  
  // Typography
  primaryFont: 'Arimo, Arial, sans-serif',
  secondaryFont: 'Gelasio, Georgia, serif',
  lineHeight: 1.15,
  
  // Colors - WCAG AA compliant
  textColor: '#404040',        // Darker grey with 8.46:1 contrast
  backgroundColor: '#e8e8e8',  // Darker background
  borderColor: '#404040',      // Same as text for consistency
  
  // Spacing
  sectionSpacing: 4,
  elementSpacing: 2,
};

// Helper function to get full image URL
const getImageUrl = (imagePath) => {
  if (!imagePath) return null;
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  if (imagePath.startsWith('/uploads')) {
    return `http://localhost:5001${imagePath}`;
  }
  return imagePath;
};

// Styled components
const PageContainer = styled(Box)({
  backgroundColor: TEMPLATE_CONFIG.backgroundColor,
  paddingTop: '40px',
  paddingBottom: '40px',
});

const SectionTitle = styled(Typography)({
  fontFamily: TEMPLATE_CONFIG.primaryFont,
  color: TEMPLATE_CONFIG.textColor,
  fontWeight: 400,
  letterSpacing: '0.05em',
  textTransform: 'uppercase',
  marginBottom: '30px',
});

const PhotoBookItem = styled(Box)({
  display: 'flex',
  gap: '20px',
  marginBottom: '40px',
  alignItems: 'flex-start',
});

const PhotoBookImage = styled(Box)({
  width: '200px',
  height: '200px',
  border: `2px solid ${TEMPLATE_CONFIG.borderColor}`,
  flexShrink: 0,
  overflow: 'hidden',
  '& img': {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
});

const PhotoBookContent = styled(Box)({
  flex: 1,
});

const ItemTitle = styled(Typography)({
  fontFamily: TEMPLATE_CONFIG.primaryFont,
  color: TEMPLATE_CONFIG.textColor,
  fontWeight: 400,
  fontSize: '1.25rem',
  textTransform: 'uppercase',
  marginBottom: '20px',
});

const ReadMoreButton = styled(Button)({
  border: `1px solid ${TEMPLATE_CONFIG.borderColor}`,
  borderRadius: 0,
  color: TEMPLATE_CONFIG.textColor,
  backgroundColor: 'transparent',
  padding: '8px 40px',
  fontFamily: TEMPLATE_CONFIG.primaryFont,
  textTransform: 'uppercase',
  fontSize: '0.875rem',
  marginTop: '20px',
  '&:hover': {
    backgroundColor: TEMPLATE_CONFIG.textColor,
    color: '#ffffff',  // Use white for better contrast on hover
    borderColor: TEMPLATE_CONFIG.textColor,
  },
});

const ArticleItem = styled(Box)({
  marginBottom: '40px',
});

const ArticleText = styled(Typography)({
  fontFamily: TEMPLATE_CONFIG.secondaryFont,
  color: TEMPLATE_CONFIG.textColor,
  fontSize: '0.95rem',
  lineHeight: 1.5,
  marginBottom: '10px',
});

const FrontPageTemplate = ({ articles = [], photoBooks = [], isPreview = false }) => {
  const theme = useTheme();
  const { settings } = useSiteSettings();

  // Sample data for preview mode
  const previewArticles = [
    {
      id: 1,
      title: 'ARTICLE TITLE',
      summary: 'photobook summary. photobook summary. photobook summary. photobook summary. photobook summary.',
      slug: '#',
    },
    {
      id: 2,
      title: 'ARTICLE TITLE',
      summary: 'photobook summary. photobook summary. photobook summary. photobook summary.',
      slug: '#',
    },
    {
      id: 3,
      title: 'ARTICLE TITLE',
      summary: 'photobook summary. photobook summary. photobook summary. photobook summary. photobook summary.',
      slug: '#',
    },
  ];

  const previewPhotoBooks = [
    {
      id: 1,
      title: 'PHOTOBOOK TITLE',
      slug: '#',
      featuredImage: 'https://via.placeholder.com/200x200?text=LISTING+IMAGE',
    },
    {
      id: 2,
      title: 'PHOTOBOOK TITLE',
      slug: '#',
      featuredImage: 'https://via.placeholder.com/200x200?text=LISTING+IMAGE',
    },
  ];

  const displayArticles = isPreview ? previewArticles : articles.slice(0, 3);
  const displayPhotoBooks = isPreview ? previewPhotoBooks : photoBooks.slice(0, 2);

  return (
    <PageContainer>
      <Container maxWidth={false} sx={{ maxWidth: '1220px' }}>
        {/* Main Content */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            gap: { xs: 4, md: 6 },
            mt: 4,
          }}
        >
          {/* Articles Section - Left (Top on mobile) */}
          <Box
            sx={{
              flex: { xs: '1 1 100%', md: '1 1 60%' }, // 60% width
              minWidth: 0, // Prevent flex item from growing beyond container
              order: { xs: 1, md: 1 }, // First on all screen sizes
            }}
          >
            <SectionTitle variant="h5">
              ARTICLES
            </SectionTitle>
            {displayArticles.map((article) => (
              <ArticleItem key={article.id}>
                <ItemTitle>
                  {article.title}
                </ItemTitle>
                <ArticleText>
                  {article.summary || article.excerpt || 'No summary available.'}
                </ArticleText>
                <ReadMoreButton href={`/articles/${article.slug}`}>
                  READ MORE
                </ReadMoreButton>
              </ArticleItem>
            ))}
          </Box>

          {/* Photo Books Section - Right (Bottom on mobile) */}
          <Box
            sx={{
              flex: { xs: '1 1 100%', md: '1 1 40%' }, // 40% width
              minWidth: 0, // Prevent flex item from growing beyond container
              order: { xs: 2, md: 2 }, // Second on all screen sizes
            }}
          >
            <SectionTitle variant="h5">
              PHOTOBOOKS
            </SectionTitle>
            {displayPhotoBooks.map((book) => (
              <PhotoBookItem key={book.id}>
                  <PhotoBookImage>
                    {(book.featuredImage || book.teaserImage) ? (
                      <img
                        src={getImageUrl(book.featuredImage || book.teaserImage)}
                        alt={book.title}
                      />
                    ) : (
                      <Box sx={{ 
                        width: '100%', 
                        height: '100%', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        backgroundColor: '#e0e0e0',
                        color: '#666',
                      }}>
                        LISTING IMAGE
                      </Box>
                    )}
                  </PhotoBookImage>
                  <PhotoBookContent>
                    <ItemTitle>
                      {book.title}
                    </ItemTitle>
                    <ReadMoreButton href={`/photobooks/${book.slug}`}>
                      READ MORE
                    </ReadMoreButton>
                  </PhotoBookContent>
                </PhotoBookItem>
            ))}
          </Box>
        </Box>
      </Container>
    </PageContainer>
  );
};

export default FrontPageTemplate;
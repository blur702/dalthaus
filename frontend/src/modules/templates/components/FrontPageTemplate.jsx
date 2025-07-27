import React from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Link,
  Paper,
  useTheme,
  alpha,
} from '@mui/material';
import { styled } from '@mui/material/styles';

// Styled components
const HeaderBanner = styled(Box)(({ theme, bannerImage, bannerHeight }) => ({
  background: bannerImage
    ? `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url(${bannerImage})`
    : `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  minHeight: bannerHeight ? `${bannerHeight}px` : '350px',
  color: 'white',
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(6, 0),
}));

const SiteTitle = styled(Box)(({ theme }) => ({
  background: alpha(theme.palette.common.white, 0.1),
  padding: theme.spacing(3),
  borderRadius: theme.shape.borderRadius,
  backdropFilter: 'blur(10px)',
}));

const MissionStatement = styled(Box)(({ theme }) => ({
  background: alpha(theme.palette.common.white, 0.1),
  padding: theme.spacing(3),
  borderRadius: theme.shape.borderRadius,
  backdropFilter: 'blur(10px)',
  maxWidth: '500px',
}));

const ContentSection = styled(Paper)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  backgroundColor: theme.palette.grey[50],
}));

const ArticleCard = styled(Card)(({ theme }) => ({
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.shadows[8],
  },
}));

const PhotoBookCard = styled(Card)(({ theme }) => ({
  height: '100%',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.shadows[8],
  },
}));

const ReadMoreLink = styled(Link)(({ theme }) => ({
  color: theme.palette.primary.main,
  textDecoration: 'none',
  fontWeight: 'bold',
  '&:hover': {
    textDecoration: 'underline',
  },
}));

const FrontPageTemplate = ({
  templateData = {},
  articles = [],
  photoBooks = [],
  isPreview = false
}) => {
  const theme = useTheme();
  
  // Extract template settings with defaults
  const {
    siteTitle = 'Your Site Title',
    siteSubtitle = 'Your tagline here',
    missionTitle = 'Your Mission Statement',
    missionText = 'Describe your mission and vision here...',
    bannerImage = null,
    bannerHeight = 350,
    primaryColor = theme.palette.primary.main,
    secondaryColor = theme.palette.secondary.main,
    showMission = true,
    articlesTitle = 'Latest Articles',
    photoBooksTitle = 'Photo Books',
    maxArticles = 3,
    maxPhotoBooks = 2,
    // Typography
    headingFont = 'Roboto',
    bodyFont = 'Open Sans',
    baseFontSize = 16,
    headingWeight = 700,
    bodyWeight = 400,
    lineHeight = 1.6,
    letterSpacing = 0,
    textTransform = 'none',
    // Spacing
    sectionSpacing = 4,
    elementSpacing = 2,
    contentPadding = 3,
    cardSpacing = 3,
    // Layout
    layoutVariant = 'classic',
    headerAlignment = 'left',
    contentLayout = 'two-column',
    cardStyle = 'elevated',
  } = templateData;

  // Sample data for preview mode
  const previewArticles = [
    {
      id: 1,
      title: 'Sample Article Title 1',
      excerpt: 'This is a sample article excerpt that demonstrates how your content will appear in the template. You can customize the layout and styling.',
      slug: '#',
      coverImageUrl: 'https://via.placeholder.com/400x250?text=Article+1',
    },
    {
      id: 2,
      title: 'Sample Article Title 2',
      excerpt: 'Another example article showing how multiple articles will be displayed in your template layout.',
      slug: '#',
      coverImageUrl: 'https://via.placeholder.com/400x250?text=Article+2',
    },
    {
      id: 3,
      title: 'Sample Article Title 3',
      excerpt: 'A third sample article to show the complete layout with multiple content items.',
      slug: '#',
      coverImageUrl: 'https://via.placeholder.com/400x250?text=Article+3',
    },
  ];

  const previewPhotoBooks = [
    {
      id: 1,
      title: 'Sample Photo Book 1',
      description: 'A beautiful collection of photographs showcasing various subjects and themes.',
      slug: '#',
      coverImageUrl: 'https://via.placeholder.com/400x300?text=Photo+Book+1',
    },
    {
      id: 2,
      title: 'Sample Photo Book 2',
      description: 'Another stunning photo book with captivating imagery and stories.',
      slug: '#',
      coverImageUrl: 'https://via.placeholder.com/400x300?text=Photo+Book+2',
    },
  ];

  const displayArticles = isPreview ? previewArticles : articles.slice(0, maxArticles);
  const displayPhotoBooks = isPreview ? previewPhotoBooks : photoBooks.slice(0, maxPhotoBooks);

  // Apply custom styles based on template settings
  const customTypography = {
    fontFamily: headingFont,
    fontWeight: headingWeight,
    letterSpacing: `${letterSpacing}em`,
    textTransform: textTransform,
  };

  const bodyTypography = {
    fontFamily: bodyFont,
    fontWeight: bodyWeight,
    fontSize: `${baseFontSize}px`,
    lineHeight: lineHeight,
  };

  // Get card elevation based on style
  const getCardElevation = () => {
    switch (cardStyle) {
      case 'flat': return 0;
      case 'elevated': return 2;
      case 'outlined': return 0;
      case 'neumorphic': return 0;
      default: return 2;
    }
  };

  // Get card style based on variant
  const getCardStyle = () => {
    const baseStyle = {
      mb: theme.spacing(cardSpacing),
      transition: 'all 0.3s ease',
    };

    switch (cardStyle) {
      case 'outlined':
        return { ...baseStyle, border: '1px solid', borderColor: 'divider' };
      case 'neumorphic':
        return {
          ...baseStyle,
          background: theme.palette.background.paper,
          boxShadow: '20px 20px 60px #d1d1d1, -20px -20px 60px #ffffff',
        };
      default:
        return baseStyle;
    }
  };

  // Get content layout grid sizes
  const getContentGridSizes = () => {
    switch (contentLayout) {
      case 'single-column':
        return { articles: 12, books: 12 };
      case 'two-column':
        return { articles: 8, books: 4 };
      case 'three-column':
        return { articles: 6, books: 3 };
      case 'grid':
      case 'masonry':
        return { articles: 12, books: 12 };
      default:
        return { articles: 8, books: 4 };
    }
  };

  const gridSizes = getContentGridSizes();

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      {/* Header Section */}
      <HeaderBanner bannerImage={bannerImage} bannerHeight={bannerHeight}>
        <Container maxWidth="lg">
          <Grid
            container
            spacing={4}
            alignItems="center"
            justifyContent={headerAlignment === 'center' ? 'center' : `flex-${headerAlignment}`}
          >
            <Grid item xs={12} md={showMission ? 6 : 12}>
              <SiteTitle sx={{ textAlign: headerAlignment }}>
                <Typography
                  variant="h2"
                  component="h1"
                  sx={{
                    ...customTypography,
                    mb: 1
                  }}
                >
                  {siteTitle}
                </Typography>
                <Typography
                  variant="h5"
                  sx={{
                    ...customTypography,
                    fontWeight: bodyWeight,
                    opacity: 0.9
                  }}
                >
                  {siteSubtitle}
                </Typography>
              </SiteTitle>
            </Grid>
            
            {showMission && (
              <Grid item xs={12} md={6}>
                <MissionStatement sx={{
                  textAlign: headerAlignment,
                  mx: headerAlignment === 'center' ? 'auto' : 0
                }}>
                  <Typography
                    variant="h4"
                    sx={{
                      ...customTypography,
                      mb: 2
                    }}
                  >
                    {missionTitle}
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      ...bodyTypography
                    }}
                  >
                    {missionText}
                  </Typography>
                </MissionStatement>
              </Grid>
            )}
          </Grid>
        </Container>
      </HeaderBanner>

      {/* Main Content */}
      <Container maxWidth="lg" sx={{ py: theme.spacing(sectionSpacing * 1.5) }}>
        <Grid container spacing={sectionSpacing}>
          {/* Articles Section */}
          <Grid item xs={12} md={gridSizes.articles}>
            <ContentSection
              elevation={0}
              sx={{
                p: theme.spacing(contentPadding),
                backgroundColor: layoutVariant === 'modern' ? 'transparent' : theme.palette.grey[50]
              }}
            >
              <Typography
                variant="h4"
                sx={{
                  ...customTypography,
                  mb: theme.spacing(elementSpacing * 2),
                  pb: theme.spacing(elementSpacing),
                  borderBottom: `3px solid ${primaryColor}`,
                  color: theme.palette.text.primary,
                }}
              >
                {articlesTitle}
              </Typography>
              
              {contentLayout === 'grid' || contentLayout === 'masonry' ? (
                <Grid container spacing={cardSpacing}>
                  {displayArticles.map((article) => (
                    <Grid item xs={12} sm={6} md={4} key={article.id}>
                      <Card
                        elevation={getCardElevation()}
                        sx={{
                          ...getCardStyle(),
                          height: '100%',
                          display: 'flex',
                          flexDirection: 'column',
                        }}
                      >
                        {article.coverImageUrl && (
                          <CardMedia
                            component="img"
                            height="200"
                            image={article.coverImageUrl}
                            alt={article.title}
                          />
                        )}
                        <CardContent sx={{ flexGrow: 1 }}>
                          <Typography
                            variant="h6"
                            gutterBottom
                            sx={{ ...customTypography }}
                          >
                            {article.title}
                          </Typography>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            paragraph
                            sx={{ ...bodyTypography, mb: theme.spacing(elementSpacing) }}
                          >
                            {article.excerpt}
                          </Typography>
                          <ReadMoreLink href={article.slug}>
                            Read the article
                          </ReadMoreLink>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              ) : (
                displayArticles.map((article) => (
                  <Card
                    key={article.id}
                    elevation={getCardElevation()}
                    sx={getCardStyle()}
                  >
                    {article.coverImageUrl && (
                      <CardMedia
                        component="img"
                        height="200"
                        image={article.coverImageUrl}
                        alt={article.title}
                      />
                    )}
                    <CardContent>
                      <Typography
                        variant="h5"
                        gutterBottom
                        sx={{ ...customTypography }}
                      >
                        {article.title}
                      </Typography>
                      <Typography
                        variant="body1"
                        color="text.secondary"
                        paragraph
                        sx={{ ...bodyTypography, mb: theme.spacing(elementSpacing) }}
                      >
                        {article.excerpt}
                      </Typography>
                      <ReadMoreLink href={article.slug}>
                        Read the article
                      </ReadMoreLink>
                    </CardContent>
                  </Card>
                ))
              )}
            </ContentSection>
          </Grid>

          {/* Photo Books Section */}
          {(contentLayout === 'two-column' || contentLayout === 'three-column') && (
            <Grid item xs={12} md={gridSizes.books}>
              <Typography
                variant="h5"
                sx={{
                  ...customTypography,
                  mb: theme.spacing(elementSpacing * 1.5),
                  color: theme.palette.text.primary,
                }}
              >
                {photoBooksTitle}
              </Typography>
              
              <Grid container spacing={cardSpacing}>
                {displayPhotoBooks.map((book) => (
                  <Grid item xs={12} key={book.id}>
                    <Card
                      elevation={getCardElevation()}
                      sx={getCardStyle()}
                    >
                      <CardMedia
                        component="img"
                        height="200"
                        image={book.coverImageUrl}
                        alt={book.title}
                      />
                      <CardContent>
                        <Typography
                          variant="h6"
                          gutterBottom
                          sx={{ ...customTypography }}
                        >
                          {book.title}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ ...bodyTypography, mb: theme.spacing(elementSpacing) }}
                        >
                          {book.description}
                        </Typography>
                        <ReadMoreLink href={book.slug}>
                          View photo book
                        </ReadMoreLink>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Grid>
          )}
        </Grid>

        {/* Photo Books for single column, grid, or masonry layouts */}
        {(contentLayout === 'single-column' || contentLayout === 'grid' || contentLayout === 'masonry') && (
          <Box sx={{ mt: theme.spacing(sectionSpacing) }}>
            <Typography
              variant="h4"
              sx={{
                ...customTypography,
                mb: theme.spacing(elementSpacing * 2),
                pb: theme.spacing(elementSpacing),
                borderBottom: `3px solid ${primaryColor}`,
                color: theme.palette.text.primary,
              }}
            >
              {photoBooksTitle}
            </Typography>
            
            <Grid container spacing={cardSpacing}>
              {displayPhotoBooks.map((book) => (
                <Grid
                  item
                  xs={12}
                  sm={contentLayout === 'single-column' ? 12 : 6}
                  md={contentLayout === 'single-column' ? 12 : 4}
                  key={book.id}
                >
                  <Card
                    elevation={getCardElevation()}
                    sx={{
                      ...getCardStyle(),
                      height: '100%',
                    }}
                  >
                    <CardMedia
                      component="img"
                      height="250"
                      image={book.coverImageUrl}
                      alt={book.title}
                    />
                    <CardContent>
                      <Typography
                        variant="h6"
                        gutterBottom
                        sx={{ ...customTypography }}
                      >
                        {book.title}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ ...bodyTypography, mb: theme.spacing(elementSpacing) }}
                      >
                        {book.description}
                      </Typography>
                      <ReadMoreLink href={book.slug}>
                        View photo book
                      </ReadMoreLink>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}
      </Container>

      {/* Footer */}
      <Box
        component="footer"
        sx={{
          bgcolor: theme.palette.grey[900],
          color: 'white',
          py: theme.spacing(sectionSpacing),
          mt: theme.spacing(sectionSpacing * 1.5),
          textAlign: 'center',
        }}
      >
        <Container maxWidth="lg">
          <Typography variant="body2" sx={{ ...bodyTypography, color: 'inherit' }}>
            © {new Date().getFullYear()} {siteTitle}. All rights reserved.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

export default FrontPageTemplate;
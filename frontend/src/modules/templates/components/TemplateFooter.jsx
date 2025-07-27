import React from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Link,
  IconButton,
  Divider,
  useTheme,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  Facebook as FacebookIcon,
  Twitter as TwitterIcon,
  Instagram as InstagramIcon,
  LinkedIn as LinkedInIcon,
  YouTube as YouTubeIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
} from '@mui/icons-material';

// Styled components
const FooterWrapper = styled(Box)(({ theme, variant, backgroundColor }) => ({
  backgroundColor: backgroundColor || theme.palette.grey[900],
  color: 'white',
  paddingTop: variant === 'detailed' ? theme.spacing(8) : theme.spacing(4),
  paddingBottom: theme.spacing(4),
  marginTop: 'auto',
}));

const FooterSection = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(3),
}));

const FooterTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 'bold',
  marginBottom: theme.spacing(2),
  color: theme.palette.common.white,
}));

const FooterLink = styled(Link)(({ theme }) => ({
  color: theme.palette.grey[300],
  textDecoration: 'none',
  display: 'block',
  marginBottom: theme.spacing(1),
  transition: 'color 0.3s',
  '&:hover': {
    color: theme.palette.primary.light,
  },
}));

const SocialIcon = styled(IconButton)(({ theme }) => ({
  color: theme.palette.grey[300],
  transition: 'color 0.3s',
  '&:hover': {
    color: theme.palette.primary.light,
  },
}));

const ContactItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  marginBottom: theme.spacing(1),
  color: theme.palette.grey[300],
  '& svg': {
    marginRight: theme.spacing(1),
    fontSize: '1.2rem',
  },
}));

const TemplateFooter = ({ 
  templateData = {},
  isPreview = false,
}) => {
  const theme = useTheme();
  
  const {
    // Footer settings
    footerVariant = 'detailed', // 'minimal', 'detailed', 'mega'
    footerBackgroundColor = theme.palette.grey[900],
    footerTextColor = theme.palette.grey[300],
    
    // Content
    siteTitle = 'Your Site Title',
    copyrightText = `© ${new Date().getFullYear()} Your Site Title. All rights reserved.`,
    footerDescription = 'Brief description of your website or organization.',
    
    // Contact info
    showContactInfo = true,
    contactEmail = 'contact@example.com',
    contactPhone = '+1 (555) 123-4567',
    contactAddress = '123 Main Street, City, State 12345',
    
    // Social media
    showSocialLinks = true,
    socialLinks = {
      facebook: '',
      twitter: '',
      instagram: '',
      linkedin: '',
      youtube: '',
    },
    
    // Footer links
    footerLinks = {
      column1: {
        title: 'Quick Links',
        links: [
          { label: 'About Us', href: '/about' },
          { label: 'Services', href: '/services' },
          { label: 'Portfolio', href: '/portfolio' },
          { label: 'Contact', href: '/contact' },
        ],
      },
      column2: {
        title: 'Resources',
        links: [
          { label: 'Blog', href: '/blog' },
          { label: 'FAQ', href: '/faq' },
          { label: 'Terms of Service', href: '/terms' },
          { label: 'Privacy Policy', href: '/privacy' },
        ],
      },
    },
  } = templateData;

  // Social media icon mapping
  const socialIcons = {
    facebook: <FacebookIcon />,
    twitter: <TwitterIcon />,
    instagram: <InstagramIcon />,
    linkedin: <LinkedInIcon />,
    youtube: <YouTubeIcon />,
  };

  if (footerVariant === 'minimal') {
    return (
      <FooterWrapper variant={footerVariant} backgroundColor={footerBackgroundColor}>
        <Container maxWidth="lg">
          <Box sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between', 
            alignItems: 'center',
            gap: 2,
          }}>
            <Typography variant="body2" sx={{ color: footerTextColor }}>
              {copyrightText}
            </Typography>
            
            {showSocialLinks && (
              <Box sx={{ display: 'flex', gap: 1 }}>
                {Object.entries(socialLinks).map(([platform, url]) => 
                  url && (
                    <SocialIcon 
                      key={platform} 
                      href={url} 
                      target="_blank"
                      size="small"
                    >
                      {socialIcons[platform]}
                    </SocialIcon>
                  )
                )}
              </Box>
            )}
          </Box>
        </Container>
      </FooterWrapper>
    );
  }

  return (
    <FooterWrapper variant={footerVariant} backgroundColor={footerBackgroundColor}>
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Company Info */}
          <Grid item xs={12} md={footerVariant === 'mega' ? 3 : 4}>
            <FooterSection>
              <FooterTitle variant="h6">{siteTitle}</FooterTitle>
              <Typography variant="body2" sx={{ color: footerTextColor, mb: 2 }}>
                {footerDescription}
              </Typography>
              
              {showSocialLinks && (
                <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                  {Object.entries(socialLinks).map(([platform, url]) => 
                    url && (
                      <SocialIcon 
                        key={platform} 
                        href={url} 
                        target="_blank"
                        size="small"
                      >
                        {socialIcons[platform]}
                      </SocialIcon>
                    )
                  )}
                </Box>
              )}
            </FooterSection>
          </Grid>

          {/* Links Columns */}
          {footerVariant === 'mega' && (
            <>
              <Grid item xs={12} sm={6} md={3}>
                <FooterSection>
                  <FooterTitle variant="subtitle1">
                    {footerLinks.column1.title}
                  </FooterTitle>
                  {footerLinks.column1.links.map((link, index) => (
                    <FooterLink key={index} href={link.href}>
                      {link.label}
                    </FooterLink>
                  ))}
                </FooterSection>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <FooterSection>
                  <FooterTitle variant="subtitle1">
                    {footerLinks.column2.title}
                  </FooterTitle>
                  {footerLinks.column2.links.map((link, index) => (
                    <FooterLink key={index} href={link.href}>
                      {link.label}
                    </FooterLink>
                  ))}
                </FooterSection>
              </Grid>
            </>
          )}

          {/* Contact Info */}
          {showContactInfo && (
            <Grid item xs={12} md={footerVariant === 'mega' ? 3 : 4}>
              <FooterSection>
                <FooterTitle variant="subtitle1">Contact Us</FooterTitle>
                
                {contactEmail && (
                  <ContactItem>
                    <EmailIcon />
                    <Link href={`mailto:${contactEmail}`} sx={{ color: 'inherit' }}>
                      {contactEmail}
                    </Link>
                  </ContactItem>
                )}
                
                {contactPhone && (
                  <ContactItem>
                    <PhoneIcon />
                    <Link href={`tel:${contactPhone}`} sx={{ color: 'inherit' }}>
                      {contactPhone}
                    </Link>
                  </ContactItem>
                )}
                
                {contactAddress && (
                  <ContactItem>
                    <LocationIcon />
                    <Typography variant="body2">
                      {contactAddress}
                    </Typography>
                  </ContactItem>
                )}
              </FooterSection>
            </Grid>
          )}

          {/* Quick Links for detailed variant */}
          {footerVariant === 'detailed' && (
            <Grid item xs={12} md={4}>
              <FooterSection>
                <FooterTitle variant="subtitle1">
                  {footerLinks.column1.title}
                </FooterTitle>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                  {footerLinks.column1.links.slice(0, 4).map((link, index) => (
                    <FooterLink key={index} href={link.href}>
                      {link.label}
                    </FooterLink>
                  ))}
                </Box>
              </FooterSection>
            </Grid>
          )}
        </Grid>

        <Divider sx={{ my: 3, borderColor: theme.palette.grey[800] }} />

        {/* Copyright */}
        <Box sx={{ 
          textAlign: 'center',
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 2,
        }}>
          <Typography variant="body2" sx={{ color: footerTextColor }}>
            {copyrightText}
          </Typography>
          
          {/* Legal Links */}
          <Box sx={{ display: 'flex', gap: 2 }}>
            <FooterLink href="/privacy" sx={{ mb: 0, fontSize: '0.875rem' }}>
              Privacy Policy
            </FooterLink>
            <Typography variant="body2" sx={{ color: theme.palette.grey[600] }}>
              |
            </Typography>
            <FooterLink href="/terms" sx={{ mb: 0, fontSize: '0.875rem' }}>
              Terms of Service
            </FooterLink>
          </Box>
        </Box>
      </Container>
    </FooterWrapper>
  );
};

export default TemplateFooter;
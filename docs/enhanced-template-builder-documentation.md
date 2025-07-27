# Enhanced Template Builder Documentation

## Overview

The Template Builder has been significantly enhanced with new customization options for typography, spacing, and layout variants. This documentation covers all the new features and how to use them effectively.

## New Features

### 1. Layout Options

#### Layout Variants
- **Classic**: Traditional blog-style layout with clear hierarchy
- **Modern**: Clean, minimalist design with subtle shadows
- **Minimal**: Ultra-clean design with maximum white space
- **Magazine**: Multi-column layout inspired by print magazines
- **Portfolio**: Grid-based layout perfect for showcasing visual content

#### Header Alignment
- **Left**: Default alignment for most use cases
- **Center**: Centered headers for a more formal appearance
- **Right**: Right-aligned headers for unique designs

#### Content Layout
- **Single Column**: Full-width content area
- **Two Column (70/30)**: Main content with sidebar
- **Three Column**: Content divided into three sections
- **Grid Layout**: Card-based grid for articles
- **Masonry Layout**: Pinterest-style dynamic grid

#### Card Styles
- **Flat**: No elevation, minimal design
- **Elevated**: Subtle shadows for depth
- **Outlined**: Border-based separation
- **Neumorphic**: Soft, extruded appearance

### 2. Typography Options

#### Font Selection
**Heading Fonts:**
- Roboto (sans-serif)
- Open Sans (sans-serif)
- Lato (sans-serif)
- Montserrat (sans-serif)
- Playfair Display (serif)
- Raleway (sans-serif)
- Poppins (sans-serif)
- Inter (sans-serif)

**Body Fonts:**
- Roboto (sans-serif)
- Open Sans (sans-serif)
- Lato (sans-serif)
- Source Sans Pro (sans-serif)
- Merriweather (serif)
- Georgia (serif)
- Inter (sans-serif)
- Nunito (sans-serif)

#### Typography Controls
- **Base Font Size**: 12px to 24px
- **Heading Weight**: 100 to 900 (in increments of 100)
- **Body Weight**: 100 to 900 (in increments of 100)
- **Line Height**: 1.0 to 2.5
- **Letter Spacing**: -0.05em to 0.2em
- **Text Transform**: None, UPPERCASE, lowercase, Capitalize

### 3. Spacing Options

- **Section Spacing**: Controls space between major sections (1-10 units)
- **Element Spacing**: Space between elements within sections (0.5-5 units)
- **Content Padding**: Internal padding of content areas (1-8 units)
- **Card Spacing**: Space between cards in layouts (0-6 units)

### 4. Color & Styling

- **Primary Color**: Main brand color
- **Secondary Color**: Accent color
- **Banner Height**: 200px to 600px
- **Banner Image**: Upload custom header image

## Usage Guide

### Accessing the Template Builder

1. Navigate to Admin Panel
2. Go to Templates → Template Builder
3. Or directly access: `/admin/templates/builder`

### Creating a New Template

1. **Choose Template Type**
   - Front Page
   - Content Page
   - Archive Page
   - Custom

2. **Configure Basic Information**
   - Site Title
   - Site Subtitle
   - Mission Statement (optional)

3. **Select Layout Options**
   - Choose a layout variant that matches your style
   - Set header alignment
   - Pick content layout based on your needs
   - Select card style for content presentation

4. **Customize Typography**
   - Select fonts for headings and body text
   - Adjust font sizes and weights
   - Fine-tune line height and letter spacing
   - Apply text transformations if needed

5. **Adjust Spacing**
   - Set comfortable spacing between sections
   - Adjust element spacing for readability
   - Configure padding for content areas
   - Set card spacing for grid layouts

6. **Apply Colors & Styling**
   - Choose primary and secondary colors
   - Set banner height
   - Upload banner image (optional)

### Best Practices

#### Typography
- **Contrast**: Use different weights for headings and body text
- **Readability**: Keep body text between 14-18px
- **Line Height**: Use 1.5-1.8 for body text
- **Font Pairing**: Choose complementary fonts (e.g., serif heading with sans-serif body)

#### Layout
- **Mobile First**: Test all layouts on mobile devices
- **Content Hierarchy**: Use spacing to create clear sections
- **White Space**: Don't be afraid of empty space
- **Consistency**: Maintain consistent spacing throughout

#### Colors
- **Accessibility**: Ensure sufficient contrast ratios
- **Brand Consistency**: Use colors that match your brand
- **Accent Sparingly**: Use secondary colors for emphasis

### Live Preview

The template builder includes a live preview that updates in real-time as you make changes. Features include:

- **Fullscreen Mode**: Toggle fullscreen for better preview
- **Responsive Preview**: See how your template looks at different sizes
- **Sample Content**: Preview with realistic content

### Saving & Exporting

#### Save Options
- **Save**: Save template to database
- **Save as New**: Create a copy with different name
- **Auto-save**: Changes are preserved in browser

#### Export/Import
- **Export**: Download template configuration as JSON
- **Import**: Upload previously exported templates
- **Generate Code**: Export production-ready code

### Template Management

After creating templates, manage them from the Template Management page:

- **View All Templates**: See all created templates
- **Set Active**: Choose which template is live
- **Clone**: Duplicate existing templates
- **Delete**: Remove unused templates

## Technical Details

### Configuration Structure

```json
{
  "configuration": {
    "siteTitle": "string",
    "siteSubtitle": "string",
    "missionTitle": "string",
    "missionText": "string",
    "showMission": "boolean",
    "articlesTitle": "string",
    "photoBooksTitle": "string",
    "maxArticles": "number",
    "maxPhotoBooks": "number",
    "primaryColor": "string",
    "secondaryColor": "string",
    "bannerImage": "string",
    "bannerHeight": "number",
    "contentWidth": "string",
    "headingFont": "string",
    "bodyFont": "string",
    "baseFontSize": "number",
    "headingWeight": "number",
    "bodyWeight": "number",
    "lineHeight": "number",
    "letterSpacing": "number",
    "textTransform": "string",
    "sectionSpacing": "number",
    "elementSpacing": "number",
    "contentPadding": "number",
    "cardSpacing": "number",
    "layoutVariant": "string",
    "headerAlignment": "string",
    "contentLayout": "string",
    "cardStyle": "string"
  }
}
```

### API Endpoints

- `GET /api/templates` - List all templates
- `GET /api/templates/:id` - Get single template
- `POST /api/templates` - Create new template
- `PUT /api/templates/:id` - Update template
- `DELETE /api/templates/:id` - Delete template
- `POST /api/templates/:id/clone` - Clone template
- `GET /api/templates/:id/export` - Export template
- `POST /api/templates/import` - Import template

## Troubleshooting

### Common Issues

1. **Preview not updating**
   - Check browser console for errors
   - Ensure all required fields are filled
   - Try refreshing the page

2. **Fonts not loading**
   - Verify internet connection
   - Check if fonts are blocked by ad blockers
   - Try different font combinations

3. **Layout breaking on mobile**
   - Use responsive layout options
   - Test with different content lengths
   - Adjust spacing for mobile screens

### Performance Tips

1. **Image Optimization**
   - Use compressed images for banners
   - Recommended size: 1920x600px max
   - Format: JPEG for photos, PNG for graphics

2. **Font Loading**
   - Limit font variations
   - Use system fonts for faster loading
   - Preload critical fonts

## Future Enhancements

Planned features for future releases:

1. **Advanced Customization**
   - Custom CSS injection
   - Component-level styling
   - Animation options

2. **Template Library**
   - Pre-built template marketplace
   - Community templates
   - Industry-specific templates

3. **A/B Testing**
   - Multiple template variants
   - Performance tracking
   - Automatic optimization

4. **Mobile-Specific Options**
   - Separate mobile layouts
   - Touch-optimized controls
   - App-like navigation

## Support

For additional help:
- Check the FAQ section
- Contact support team
- Join community forums
- Watch video tutorials
# Enhanced Template Editor Documentation

## Overview

The Enhanced Template Editor provides a comprehensive interface for customizing website templates with granular control over headers, footers, global settings, and content layout. The editor is divided into three main sections accessible via tabs:

1. **Content** - Basic template content and layout settings
2. **Header/Footer** - Detailed header and footer customization
3. **Global** - Site-wide typography, colors, and spacing settings

## Features

### Header/Footer Editor

The Header/Footer Editor provides extensive customization options for your site's header and footer sections.

#### Header Settings

**Dimensions**
- **Height**: Adjustable from 40px to 200px using a slider
- **Width**: Set as percentage or pixels (default: 100%)

**Behavior**
- **Sticky Header**: Toggle to make header stay at top when scrolling

**Background**
- **Background Color**: Color picker for header background
- **Background Opacity**: Adjust transparency from 0-100%
- **Background Image**: Upload custom background image
  - Position options: center, top, bottom, left, right
  - Size options: cover, contain, auto, stretch
  - Repeat options: no-repeat, repeat, repeat-x, repeat-y

**Spacing & Effects**
- **Padding**: Individual control for top, bottom, left, right padding
- **Box Shadow**: Custom CSS box-shadow value
- **Border Bottom**: Custom border styling

#### Footer Settings

**Dimensions**
- **Height**: Adjustable from 100px to 400px
- **Width**: Set as percentage or pixels (default: 100%)

**Background & Colors**
- **Background Color**: Primary footer background
- **Text Color**: Default text color in footer
- **Link Color**: Color for footer links
- **Background Opacity**: Transparency control
- **Background Image**: Optional background image with same controls as header

**Layout & Content**
- **Footer Layout**: Choose from single, two, three, or four column layouts
- **Show Social Links**: Toggle social media links section
- **Show Contact Information**: Toggle contact info display
- **Show Newsletter Signup**: Toggle newsletter subscription form

**Spacing**
- **Padding**: Individual control for all four sides

### Global Settings Editor

The Global Settings Editor controls site-wide design elements that serve as defaults across all templates.

#### Typography

**Font Selection**
- **Primary Font (Headings)**: Choose from curated font list including:
  - Roboto, Open Sans, Lato, Montserrat, Playfair Display, Raleway, Poppins, Inter, Source Sans Pro, Merriweather
- **Secondary Font (Body)**: Select body text font
- **Font Preview**: Live preview of selected fonts

**Font Sizing**
- **Base Font Size**: 12-24px (affects all relative sizing)
- **Font Scale Ratio**: 1.1-1.5 (controls heading size progression)
  - Minor Third (1.2)
  - Major Third (1.25)
  - Perfect Fourth (1.333)

**Text Properties**
- **Body Line Height**: 1.2-2.0
- **Letter Spacing**: -0.05em to 0.15em
- **Paragraph Spacing**: 0.5-2em

#### Heading Styles

Individual control for H1-H6 elements:
- **Size (rem)**: Relative to base font size
- **Weight**: 100-900 (font weight)
- **Line Height**: 1-2
- **Custom Color**: Optional override of default text color

#### Color Palette

**Theme Colors**
- Primary Color
- Secondary Color
- Text Color
- Background Color

**Status Colors**
- Success (green)
- Error (red)
- Warning (orange)
- Info (blue)

#### Body & Content Settings

- **Body Background Color**
- **Body Text Color**
- **Link Color**
- **Link Hover Color**

#### Spacing & Layout

**Container Settings**
- **Container Max Width**: Maximum content width in pixels
- **Container Padding**: Horizontal padding for content

**Spacing**
- **Section Spacing**: 20-120px between major sections
- **Element Spacing**: 8-48px between elements
- **Component Spacing**: 4-32px within components

#### Borders & Effects

- **Border Radius**: 0-24px for rounded corners
- **Border Color**: Default border color
- **Box Shadow**: Default shadow for elevated elements

## Technical Implementation

### Database Schema

The Template model has been enhanced with:

```javascript
{
  headerSettings: {
    height: Number,
    width: Number,
    widthUnit: String,
    sticky: Boolean,
    backgroundColor: String,
    backgroundImage: String,
    backgroundOpacity: Number,
    backgroundPosition: String,
    backgroundSize: String,
    backgroundRepeat: String,
    padding: Object,
    boxShadow: String,
    borderBottom: String,
    // ... existing settings
  },
  footerSettings: {
    height: Number,
    width: Number,
    widthUnit: String,
    backgroundColor: String,
    backgroundImage: String,
    backgroundOpacity: Number,
    textColor: String,
    linkColor: String,
    layout: String,
    showSocialLinks: Boolean,
    showContactInfo: Boolean,
    showNewsletter: Boolean,
    padding: Object,
    // ... existing settings
  },
  globalSettings: {
    // Typography
    primaryFont: String,
    secondaryFont: String,
    baseFontSize: Number,
    fontScale: Number,
    // Colors
    primaryColor: String,
    secondaryColor: String,
    textColor: String,
    backgroundColor: String,
    // ... all other global settings
  }
}
```

### Components

**HeaderFooterEditor.jsx**
- Tabbed interface for header/footer settings
- Accordion-based organization
- Real-time preview updates

**GlobalSettingsEditor.jsx**
- Comprehensive global settings management
- Font preview functionality
- Organized into logical sections

**Integration**
- Seamlessly integrated into TemplateBuilder.jsx
- Uses existing template service for data persistence
- Maintains backward compatibility

## Usage Guide

### Creating a New Template

1. Navigate to Templates > Template Builder
2. Configure basic content in the Content tab
3. Switch to Header/Footer tab to customize header and footer
4. Use Global tab to set site-wide defaults
5. Click Save to persist changes

### Editing Existing Templates

1. Load template in Template Builder
2. All settings automatically populate from saved configuration
3. Make desired changes across any tabs
4. Save to update template

### Best Practices

1. **Start with Global Settings**: Define your typography and color palette first
2. **Test Responsive Behavior**: Preview at different screen sizes
3. **Use Consistent Spacing**: Leverage the spacing scale for harmony
4. **Consider Performance**: Be mindful of image sizes for backgrounds
5. **Maintain Contrast**: Ensure text remains readable over backgrounds

## API Endpoints

All template endpoints support the enhanced configuration:

- `GET /api/templates` - List all templates
- `GET /api/templates/:id` - Get single template with all settings
- `POST /api/templates` - Create with header/footer/global settings
- `PUT /api/templates/:id` - Update all settings
- `POST /api/templates/:id/clone` - Clone including all settings
- `GET /api/templates/:id/export` - Export complete configuration
- `POST /api/templates/import` - Import with all settings

## Migration

Existing templates are automatically compatible. Default values are provided for all new fields, ensuring backward compatibility.
# Template System Documentation

## Overview

The CMS now features a comprehensive templating system that allows users to create, customize, and apply templates to the public frontend. This system includes a Material UI-based template builder in the admin panel and a dynamic template loader for the public frontend.

## Architecture

### Backend Components

1. **Database Model** (`backend/src/models/templates.model.js`)
   - Stores template configurations with JSON fields
   - Supports multiple template types (front_page, content_page, archive_page, custom)
   - Includes activation system (only one template active per type)
   - Tracks created/updated by user references

2. **API Endpoints** (`backend/src/controllers/templates.controller.js`)
   - CRUD operations for templates
   - Special operations: clone, export, import
   - Public endpoints for fetching active templates
   - Authentication protected admin endpoints

3. **Routes**
   - Admin routes: `/api/templates/*` (protected)
   - Public routes: `/api/public/templates/*` (no auth required)

### Frontend Components

1. **Admin Panel (React + Material UI)**
   - **Template Builder** (`frontend/src/modules/templates/pages/TemplateBuilder.jsx`)
     - Split-screen interface with customizer and live preview
     - Real-time template customization
     - Import/export functionality
   
   - **Template Management** (`frontend/src/modules/templates/pages/TemplateManagement.jsx`)
     - List all templates with search and filter
     - Create, edit, delete, and activate templates
     - Clone existing templates

   - **Template Components**
     - `FrontPageTemplate.jsx` - Main template component
     - `TemplateCustomizer.jsx` - Customization interface
     - `TemplateHeader.jsx` - Reusable header component
     - `TemplateFooter.jsx` - Reusable footer component

2. **Public Frontend**
   - **Template Loader** (`public-frontend/js/template-loader.js`)
     - Automatically loads active template on page load
     - Applies template configuration to DOM elements
     - Supports dynamic styling and content updates

## Template Configuration Structure

```javascript
{
  name: "Template Name",
  slug: "template-slug",
  type: "front_page",
  description: "Template description",
  isActive: true,
  configuration: {
    // Site Information
    siteTitle: "Site Title",
    siteSubtitle: "Subtitle",
    
    // Mission Statement
    missionTitle: "Mission Title",
    missionText: "Mission text...",
    showMission: true,
    
    // Colors
    primaryColor: "#2c3e50",
    backgroundColor: "#ffffff",
    textColor: "#333333",
    headerBgColor: "#f8f9fa",
    footerBgColor: "#2c3e50",
    
    // Typography
    fontFamily: "Georgia, serif",
    fontSize: "16px",
    headingFont: "Helvetica, Arial, sans-serif",
    
    // Spacing
    containerPadding: "20px",
    sectionSpacing: "40px",
    elementSpacing: "20px"
  },
  headerSettings: {
    headerVariant: "banner",
    showNavigation: true,
    navPosition: "below",
    showMission: true
  },
  footerSettings: {
    footerVariant: "detailed",
    showContactInfo: true,
    showSocialLinks: true
  },
  layoutSettings: {
    contentWidth: "lg",
    showSidebar: false,
    sidebarPosition: "right"
  }
}
```

## Usage Guide

### Creating a New Template

1. Navigate to Settings > Templates in the admin panel
2. Click "Create New Template"
3. Use the Template Builder interface:
   - Customize settings in the left panel
   - See live preview on the right
   - Save template when satisfied

### Editing Templates

1. Go to the Templates management page
2. Click the edit icon next to any template
3. Make changes in the Template Builder
4. Save to update the template

### Activating a Template

1. From the Templates management page
2. Click the activate icon for the desired template
3. Confirm activation (this will deactivate other templates of the same type)

### Exporting/Importing Templates

1. **Export**: Click the menu button in Template Builder and select "Export Template"
2. **Import**: Click "Import Template" and select a JSON file
3. Templates are exported as JSON files for easy sharing

## API Reference

### Public Endpoints

- `GET /api/public/templates/active/:type` - Get active template by type
- `GET /api/public/templates/slug/:slug` - Get template by slug

### Admin Endpoints (Auth Required)

- `GET /api/templates` - List all templates
- `GET /api/templates/:id` - Get specific template
- `POST /api/templates` - Create new template
- `PUT /api/templates/:id` - Update template
- `DELETE /api/templates/:id` - Delete template
- `POST /api/templates/:id/clone` - Clone template
- `GET /api/templates/:id/export` - Export template
- `POST /api/templates/import` - Import template

## Default Templates

The system includes three default templates:

1. **Classic Photography** - Clean, professional design
2. **Modern Minimal** - Minimalist with focus on content
3. **Gallery Focus** - Designed for photo galleries with sidebar

These are seeded automatically when the server starts.

## Frontend Integration

The public frontend automatically loads and applies the active template using the `template-loader.js` script. This script:

1. Fetches the active template on page load
2. Applies configuration to DOM elements
3. Updates CSS variables for dynamic styling
4. Handles responsive layout changes

### Supported Elements

The template loader looks for these elements/classes:
- `.site-title`, `h1.brand` - Site title
- `.site-subtitle`, `.tagline` - Site subtitle
- `.mission-title`, `.mission h2` - Mission title
- `.mission-text`, `.mission p` - Mission text
- `header`, `.header` - Header element
- `footer`, `.footer` - Footer element
- `.container`, `.main-container`, `main` - Main content container
- `.sidebar`, `aside` - Sidebar element

## Development Notes

### Adding New Template Options

1. Update the template model schema if needed
2. Add new fields to the TemplateCustomizer component
3. Update the template loader to handle new options
4. Add corresponding UI elements in FrontPageTemplate

### Creating New Template Types

1. Add the type to the model ENUM
2. Create a new template component
3. Update the template builder to support the new type
4. Add preview functionality for the new type

## Troubleshooting

### Templates Not Loading
- Check if backend server is running
- Verify template routes are properly registered
- Ensure at least one template is active
- Check browser console for errors

### Customizations Not Applying
- Verify template loader script is included
- Check that DOM elements have correct classes
- Ensure template configuration is valid JSON
- Look for CSS specificity conflicts

### Database Issues
- Run migrations: `npx sequelize-cli db:migrate`
- Check database connection settings
- Verify Template model is properly imported

## Future Enhancements

1. Template versioning system
2. Template marketplace/sharing
3. Mobile-specific template options
4. A/B testing support
5. Template analytics
6. CSS preprocessor support
7. Component-based template system
8. Template inheritance/extending
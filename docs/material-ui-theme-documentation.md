# Material UI Theme Documentation

## Overview

This document describes the Material UI theme configuration for the Don Althaus Photography application. The theme has been designed to maintain consistency with the existing visual design while leveraging Material UI's powerful theming system.

## Theme Structure

The theme configuration is organized in the following structure:

```
frontend/src/theme/
├── index.js      # Main exports for theme modules
├── palette.js    # Color palette configuration
└── theme.js      # Complete theme configuration
```

## Color Palette

### Primary Colors
- **Main**: `#2c3e50` (Navy Blue)
- **Light**: `#34495e`
- **Dark**: `#1a252f`
- **Contrast Text**: `#ffffff`

### Secondary Colors
- **Main**: `#4CAF50` (Green)
- **Light**: `#81C784`
- **Dark**: `#388E3C`
- **Contrast Text**: `#ffffff`

### System Colors
- **Error**: `#f44336` (Red)
- **Warning**: `#ffc107` (Amber)
- **Info**: `#3498db` (Blue)
- **Success**: `#27ae60` (Green)

### Role-Based Colors
- **Superuser**: `#e74c3c`
- **Admin**: `#3498db`
- **User**: `#95a5a6`

### Status Colors
- **Draft**: `#f39c12`
- **Published**: `#27ae60`
- **Archived**: `#95a5a6`

## Typography

The theme uses a system font stack for optimal performance and native feel:

```javascript
fontFamily: [
  '-apple-system',
  'BlinkMacSystemFont',
  '"Segoe UI"',
  'Roboto',
  '"Helvetica Neue"',
  'Arial',
  'sans-serif',
].join(',')
```

### Heading Sizes
- **H1**: 2.5rem (2rem on mobile)
- **H2**: 2rem (1.5rem on mobile)
- **H3**: 1.75rem (1.25rem on mobile)
- **H4**: 1.5rem
- **H5**: 1.25rem
- **H6**: 1.125rem

## Component Customizations

### Buttons
- Border radius: 4px
- Text transform: none (no uppercase)
- Three sizes: small, medium, large
- Custom padding and hover states

### Text Fields
- Default variant: outlined
- Custom focus colors matching theme
- Consistent border styling

### Cards
- Border radius: 8px
- Subtle shadow with hover effect
- Smooth transitions

### Tables
- Alternating row colors on hover
- Styled header with background
- Clean borders

## Usage Examples

### Basic Theme Import
```javascript
import { ThemeProvider, CssBaseline } from '@mui/material';
import { theme } from './theme';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {/* Your app content */}
    </ThemeProvider>
  );
}
```

### Using Theme Colors
```javascript
import { useTheme } from '@mui/material/styles';
import { palette } from './theme/palette';

function MyComponent() {
  const theme = useTheme();
  
  return (
    <Box sx={{ 
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.primary.contrastText 
    }}>
      Content
    </Box>
  );
}
```

### Custom Styled Components
```javascript
import { styled } from '@mui/material/styles';
import { palette } from './theme/palette';

const CustomCard = styled(Card)(({ theme }) => ({
  backgroundColor: palette.ui.hover,
  '&:hover': {
    boxShadow: theme.shadows[4],
  },
}));
```

## Responsive Design

The theme includes responsive breakpoints:
- **xs**: 0px
- **sm**: 600px
- **md**: 960px
- **lg**: 1280px
- **xl**: 1920px

Typography automatically adjusts for smaller screens.

## Custom Theme Properties

The theme includes custom properties for specific use cases:

```javascript
theme.custom = {
  sidebar: {
    width: 240,
    collapsedWidth: 64,
  },
  appBar: {
    height: 64,
    mobileHeight: 56,
  },
  footer: {
    height: 100,
  },
  content: {
    maxWidth: 1200,
  },
}
```

## Gradients

Pre-defined gradients are available:
- `gradients.primary`: Navy blue gradient
- `gradients.secondary`: Green gradient
- `gradients.success`: Success green gradient
- `gradients.dark`: Dark gradient for headers

## Shadows

Custom shadow definitions:
- `shadows.small`: Subtle shadow for cards
- `shadows.medium`: Standard elevation
- `shadows.large`: High elevation
- `shadows.hover`: Interactive hover state

## Best Practices

1. **Use Theme Colors**: Always reference colors from the theme rather than hardcoding
2. **Leverage sx Prop**: Use the sx prop for one-off styling
3. **Create Styled Components**: For reusable styled elements
4. **Responsive Units**: Use theme.spacing() for consistent spacing
5. **Typography Variants**: Use predefined typography variants

## Migration Notes

When migrating components:
1. Replace custom CSS classes with MUI components
2. Use theme colors instead of hardcoded values
3. Leverage MUI's built-in responsive features
4. Utilize component props for variants and sizes
5. Remove redundant CSS files after migration

## Future Enhancements

- Dark mode support
- Additional color schemes
- Custom animation definitions
- Enhanced accessibility features
- Print-specific styles
# Public Frontend React Application

A modern React-based public frontend built with Vite and Material UI, matching the design system used in the admin panel.

## Features

- ⚡️ Built with Vite for fast development and building
- 🎨 Material UI components with custom theme
- 🚀 React Router for navigation
- 📱 Responsive design
- 🎯 Consistent design system with admin panel

## Project Structure

```
public-frontend-react/
├── src/
│   ├── components/         # Reusable components
│   │   ├── Header.jsx     # Navigation header
│   │   └── Footer.jsx     # Site footer
│   ├── layouts/           # Layout components
│   │   └── Layout.jsx     # Main layout wrapper
│   ├── pages/             # Page components
│   │   └── Home.jsx       # Home page
│   ├── theme/             # Material UI theme configuration
│   │   ├── palette.js     # Color palette
│   │   └── theme.js       # Theme configuration
│   ├── App.jsx            # Main app component
│   ├── main.jsx           # Entry point
│   └── index.css          # Global styles
├── index.html             # HTML template
├── vite.config.js         # Vite configuration
└── package.json           # Dependencies and scripts
```

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Navigate to the project directory:
   ```bash
   cd public_html/public-frontend-react
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

   The application will be available at `http://localhost:3001`

### Available Scripts

- `npm run dev` - Start the development server on port 3001
- `npm run build` - Build for production
- `npm run preview` - Preview the production build

## Development

### Adding New Pages

1. Create a new component in `src/pages/`
2. Add the route in `src/App.jsx`
3. Update navigation in `src/components/Header.jsx`

### Customizing the Theme

The theme configuration is located in `src/theme/`. You can modify:
- `palette.js` - Color definitions
- `theme.js` - Material UI theme overrides

### Component Guidelines

- Use Material UI components for consistency
- Follow the existing folder structure
- Keep components focused and reusable
- Use the theme for colors and spacing

## Deployment

To build for production:

```bash
npm run build
```

This will create an optimized build in the `dist/` directory.

## Technologies Used

- React 18
- Vite
- Material UI v6
- React Router v7
- Emotion (CSS-in-JS)

## Notes

- The development server runs on port 3001 to avoid conflicts with other services
- The theme matches the admin frontend for visual consistency
- All Material UI components are customized through the theme configuration
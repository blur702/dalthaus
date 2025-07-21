# Admin Panel Frontend

React-based frontend for the Admin Panel CMS.

## Features

- 🔐 JWT-based authentication with protected routes
- 👥 User management interface
- 📄 Content management for Articles, Pages, and Photo Books
- ✏️ Rich text editing with TinyMCE
- ⚙️ TinyMCE settings management
- 📎 Document upload and conversion
- 🎨 Responsive design
- 🛡️ Error boundaries for graceful error handling

## Tech Stack

- **React 18** - UI library
- **React Router v6** - Client-side routing
- **Vite** - Build tool and dev server
- **Axios** - HTTP client
- **TinyMCE React** - Rich text editor integration

## Prerequisites

- Node.js v18 or higher
- npm or yarn package manager

## Installation

1. Install dependencies:
```bash
npm install
```

2. Configure API endpoint in `vite.config.js` if needed (default: `http://localhost:5001`)

## Development

### Start Development Server
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Build for Production
```bash
npm run build
```

Build output will be in the `dist/` directory.

### Preview Production Build
```bash
npm run preview
```

## Project Structure

```
frontend/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── AdminLayout.jsx  # Main layout wrapper
│   │   ├── Header.jsx       # Navigation header
│   │   ├── Footer.jsx       # Footer component
│   │   ├── ProtectedRoute.jsx # Auth route guard
│   │   ├── RichTextEditor.jsx # TinyMCE wrapper
│   │   └── ErrorBoundary.jsx  # Error handling
│   ├── modules/            # Feature modules
│   │   ├── content/        # Content management
│   │   │   ├── components/ # Content-specific components
│   │   │   ├── pages/      # Content pages
│   │   │   └── services/   # Content API services
│   │   ├── settings/       # Settings management
│   │   │   └── TinymceSettings.jsx
│   │   └── users/          # User management
│   │       ├── components/ # User-specific components
│   │       ├── pages/      # User pages
│   │       └── services/   # User API services
│   ├── pages/              # Top-level pages
│   │   ├── LoginPage.jsx   # Login interface
│   │   ├── AdminDashboard.jsx # Main dashboard
│   │   └── ContentPreview.jsx # Content preview
│   ├── services/           # Global services
│   │   └── api.js          # Axios configuration
│   ├── App.jsx            # Root component
│   ├── App.css            # Global styles
│   └── main.jsx           # Entry point
├── public/                # Static assets
│   └── tinymce/          # TinyMCE assets
├── index.html            # HTML template
├── vite.config.js        # Vite configuration
└── package.json          # Dependencies
```

## Key Components

### Authentication
- **LoginPage**: User login interface
- **ProtectedRoute**: HOC for route protection
- **api.js**: Axios interceptors for token management

### Layout
- **AdminLayout**: Main layout with sidebar navigation
- **Header**: Top navigation with user menu
- **ErrorBoundary**: Catches and displays React errors

### Content Management
- **ContentEditor**: Unified editor for all content types
- **ContentList**: Paginated content listing
- **ContentViewer**: Preview component with pagebreak support

### User Management
- **UserList**: Display users with search/filter
- **UserModal**: Create/edit user form
- **UserManagement**: Main user management page

### Settings
- **TinymceSettings**: Complete TinyMCE configuration UI
- **SettingsList**: Browse and search settings
- **SettingsEditor**: Visual configuration editor
- **SettingsPreview**: Live preview of configurations

## API Integration

The frontend communicates with the backend API using Axios. All API calls go through the `api.js` service which:
- Adds JWT token to requests
- Handles token expiration
- Provides consistent error handling

### API Configuration

Base URL is configured in `vite.config.js`:
```javascript
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:5001',
      changeOrigin: true
    }
  }
}
```

## State Management

The application uses React's built-in state management:
- `useState` for component state
- `useEffect` for side effects
- `useRef` for persistent values
- Props passing for data flow

## Routing

Routes are defined in `App.jsx`:
- `/login` - Login page
- `/admin` - Dashboard (protected)
- `/admin/users` - User management (protected)
- `/admin/content/*` - Content management (protected)
- `/admin/settings/tinymce` - TinyMCE settings (protected)
- `/preview/:type/:id` - Public content preview

## Styling

The application uses:
- CSS modules for component styles
- Global styles in `App.css`
- Inline styles for dynamic styling
- Responsive design principles

## Error Handling

- **ErrorBoundary** component catches React errors
- API errors display user-friendly messages
- Form validation with inline error messages
- Loading states for async operations

## Performance Optimizations

- Code splitting with React.lazy (where applicable)
- Debounced search inputs
- Pagination for large data sets
- Optimized TinyMCE initialization

## Security

- JWT tokens stored in localStorage
- Automatic logout on token expiration
- XSS protection in content rendering
- CORS handled by backend

## Testing

The project includes Playwright tests in `/test-suite/`:
```bash
cd ../test-suite
node comprehensive-tests.js
```

## Build & Deployment

### Development Build
```bash
npm run dev
```

### Production Build
```bash
npm run build
```

### Deployment Steps
1. Build the application
2. Deploy `dist/` contents to web server
3. Configure web server to serve `index.html` for all routes
4. Set up reverse proxy for `/api` routes

### Nginx Configuration Example
```nginx
server {
    listen 80;
    server_name yourdomain.com;
    root /var/www/html;
    
    location / {
        try_files $uri /index.html;
    }
    
    location /api {
        proxy_pass http://localhost:5001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## Environment Variables

Create `.env` file for environment-specific settings:
```env
VITE_API_URL=http://localhost:5001
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Known Issues

- TinyMCE may take a moment to load on slower connections
- Large content may cause performance issues in editor

## Contributing

1. Fork the repository
2. Create feature branch
3. Make changes
4. Run tests
5. Submit pull request

## License

Part of the Admin Panel CMS project.
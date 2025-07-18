# System Architecture

## Design Principles

1. **Separation of Concerns**
   - Frontend and backend are completely separate
   - Feature modules are isolated (users, content)
   - Business logic separated from routes

2. **Modularity**
   - Each feature is a self-contained module
   - Reusable components and services
   - Clear folder structure

3. **Security First**
   - JWT authentication
   - Role-based access control
   - Input validation
   - Secure password storage

## Backend Architecture

### Layer Structure

```
Request → Routes → Middleware → Controllers → Models → Database
```

### Key Components

#### Models (`/backend/src/models/`)
- **User Model**: Handles user data and authentication
- **BaseContent Model**: Single table for all content types
- **Content Type Models**: Filtered views of BaseContent

#### Controllers (`/backend/src/controllers/`)
- Handle business logic
- Validate input
- Format responses
- Handle errors

#### Middleware (`/backend/src/middleware/`)
- `protect`: Verifies JWT token
- `isAdmin`: Checks admin/superuser role

#### Routes (`/backend/src/routes/`)
- Define API endpoints
- Apply middleware
- Call controllers

### Database Design

#### Single Table Inheritance Pattern
All content types (Articles, Pages, Photo Books) share one table with a discriminator field (`contentType`). This allows:
- Unified querying
- Consistent fields
- Easy extension
- Simplified relationships

#### Associations
```
User (1) → (N) Content
Content (1) → (N) Content (parent-child for pages)
```

## Frontend Architecture

### Component Hierarchy

```
App
├── Router
│   ├── LoginPage
│   ├── ProtectedRoute
│   │   └── AdminLayout
│   │       ├── Header
│   │       ├── Main Content
│   │       │   ├── Dashboard
│   │       │   ├── UserManagement
│   │       │   └── ContentManagement
│   │       └── Footer
```

### Module Structure

Each feature module contains:
```
/modules/[feature]/
├── components/     # UI components
├── pages/         # Page components
└── services/      # API communication
```

### State Management
- Local component state with React hooks
- Authentication state in App component
- No global state management (kept simple)

### API Communication
- Centralized API service with axios
- Automatic token injection via interceptors
- Consistent error handling

## Security Architecture

### Authentication Flow
1. User submits credentials
2. Backend validates and returns JWT
3. Frontend stores token in localStorage
4. Token included in all API requests
5. Backend validates token on protected routes

### Authorization Levels
1. **Public**: No authentication required
2. **Authenticated**: Valid JWT required
3. **Admin**: Admin or superuser role required

### Security Measures
- Password hashing with bcrypt
- JWT expiration (1 hour)
- HTTPS in production
- Sanitized user input
- Protected API endpoints

## Deployment Architecture

### Development
- Frontend: Vite dev server (port 5173)
- Backend: Node.js server (port 5001)
- Database: Local PostgreSQL

### Production
- Single Express server
- Serves built React app
- API routes under `/api/*`
- Static files from `/var/www/public_html/`

## Data Flow Examples

### User Login
1. User enters credentials
2. Frontend POST to `/api/auth/login`
3. Backend validates credentials
4. Backend generates JWT
5. Frontend stores token
6. Frontend redirects to dashboard

### Create Content
1. User fills form
2. Frontend POST to `/api/content/articles`
3. Middleware validates JWT
4. Controller creates content
5. Database stores record
6. Frontend updates UI

## Extension Points

### Adding New Content Types
1. Add type to contentType enum in BaseContent
2. Create filtered model class
3. Create controller extending BaseContentController
4. Create routes file
5. Add frontend components

### Adding New Features
1. Create module folder structure
2. Implement models if needed
3. Create controllers and routes
4. Build frontend components
5. Add navigation links

## Performance Considerations

- Database indexes on slug, contentType
- Pagination for content lists
- Lazy loading for modules
- Minimal bundle size
- Efficient queries with Sequelize

## Monitoring & Logging

- Console logging for errors
- Structured error responses
- Development vs production error detail
- Request logging in development
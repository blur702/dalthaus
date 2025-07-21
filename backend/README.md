# Admin Panel Backend

Express.js backend API for the Admin Panel CMS.

## Overview

This backend provides a RESTful API for:
- User authentication and management
- Content management (Articles, Pages, Photo Books)
- TinyMCE editor settings management
- Document conversion integration

## Setup

### Prerequisites
- Node.js v18+
- PostgreSQL v12+
- Python 3.8+ (for document converter)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file:
```env
JWT_SECRET=your-secure-secret-key
NODE_ENV=development
PORT=5001
```

3. Configure database in `/var/www/config/database.json`:
```json
{
  "development": {
    "username": "your_db_user",
    "password": "your_db_password",
    "database": "admin_panel_dev",
    "host": "127.0.0.1",
    "dialect": "postgres"
  }
}
```

4. Start the server:
```bash
npm start         # Production
npm run dev      # Development with nodemon
```

## Database Models

### User
- `id` (UUID)
- `username` (String, unique)
- `passwordHash` (String)
- `role` (String: 'user' | 'superuser')

### BaseContent (polymorphic)
- `id` (UUID)
- `title` (String)
- `slug` (String, unique)
- `body` (Text)
- `status` (Enum: 'draft' | 'published' | 'archived')
- `contentType` (Enum: 'article' | 'page' | 'photoBook')
- `authorId` (UUID, foreign key)
- `publishedAt` (Date)
- `pageCount` (Integer, auto-calculated)
- `metadata` (JSONB)
- `parentId` (UUID, optional)

### TinymceSettings
- `id` (UUID)
- `name` (String, unique)
- `description` (Text)
- `settings` (JSONB)
- `isDefault` (Boolean)
- `isPreset` (Boolean)
- `tags` (Array)
- `createdBy` (UUID)
- `updatedBy` (UUID)

## API Endpoints

### Authentication
```
POST   /api/auth/login     - Login with username/password
GET    /api/auth/verify    - Verify JWT token
```

### Users (Admin only)
```
GET    /api/users          - List all users
GET    /api/users/:id      - Get user by ID
POST   /api/users          - Create new user
PUT    /api/users/:id      - Update user
DELETE /api/users/:id      - Delete user
```

### Content Management
```
GET    /api/content/{type}         - List content
GET    /api/content/{type}/:id     - Get single content
POST   /api/content/{type}         - Create content
PUT    /api/content/{type}/:id     - Update content
DELETE /api/content/{type}/:id     - Delete content
```

Where `{type}` is one of: `articles`, `pages`, `photo-books`

### TinyMCE Settings (Admin only)
```
GET    /api/admin/tinymce-settings           - List all settings
GET    /api/admin/tinymce-settings/default   - Get default setting
GET    /api/admin/tinymce-settings/:id       - Get specific setting
POST   /api/admin/tinymce-settings           - Create new setting
PUT    /api/admin/tinymce-settings/:id       - Update setting
DELETE /api/admin/tinymce-settings/:id       - Delete setting
GET    /api/admin/tinymce-settings/:id/export - Export as JSON
POST   /api/admin/tinymce-settings/import    - Import from JSON
POST   /api/admin/tinymce-settings/:id/duplicate - Duplicate setting
```

### Document Conversion
```
POST   /api/document/convert    - Convert document to HTML
GET    /api/document/formats    - Get supported formats
GET    /api/document/health     - Check converter health
```

## Middleware

### Authentication (`auth.middleware.js`)
- `protect` - Validates JWT token
- `isAdmin` - Checks for admin/superuser role

## Security

- JWT tokens with 7-day expiration
- bcrypt password hashing (12 rounds)
- Environment-based configuration
- CORS enabled
- Input validation on all endpoints
- SQL injection prevention via Sequelize

## Database Seeds

On startup, the server automatically:
1. Creates admin user (username: `admin`, password: `(130Bpm)`)
2. Seeds 5 TinyMCE preset configurations

## Error Handling

All endpoints return consistent error responses:
```json
{
  "error": "Error message here"
}
```

HTTP status codes:
- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Server Error

## Logging

Uses custom logger utility that:
- Logs to console in development
- Can be extended for production logging services
- Respects NODE_ENV setting

## Document Converter Service

The document converter is a separate Python microservice. See `/src/services/documentConverter/README.md` for setup instructions.

## Development

### File Structure
```
backend/
├── src/
│   ├── config/         # Database configuration
│   ├── controllers/    # Request handlers
│   ├── middleware/     # Express middleware
│   ├── models/         # Sequelize models
│   ├── routes/         # Route definitions
│   ├── services/       # Business logic
│   └── utils/          # Helper utilities
├── .env               # Environment variables
├── server.js          # Application entry point
└── package.json       # Dependencies
```

### Adding New Features

1. Create model in `src/models/`
2. Create controller in `src/controllers/`
3. Create routes in `src/routes/`
4. Register routes in `server.js`
5. Add middleware as needed

## Testing

Run the test suite:
```bash
npm test
```

## Production Considerations

1. Set `NODE_ENV=production`
2. Use strong JWT_SECRET
3. Configure proper database credentials
4. Enable HTTPS
5. Set up proper logging
6. Configure rate limiting
7. Set up monitoring
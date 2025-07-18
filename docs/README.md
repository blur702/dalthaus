# Admin Panel Documentation

## Overview

This is a full-stack web application with a secure admin panel built using:
- **Backend**: Node.js, Express.js, PostgreSQL, Sequelize ORM
- **Frontend**: React, Vite, React Router
- **Authentication**: JWT tokens with bcrypt password hashing

## Project Structure

```
/var/www/public_html/
├── backend/                    # Backend API server
│   ├── src/
│   │   ├── config/            # Database configuration
│   │   ├── controllers/       # Request handlers
│   │   ├── middleware/        # Auth middleware
│   │   ├── models/           # Database models
│   │   └── routes/           # API routes
│   └── server.js             # Main server file
├── frontend/                  # React frontend
│   ├── src/
│   │   ├── components/       # Reusable components
│   │   ├── modules/          # Feature modules
│   │   ├── pages/            # Page components
│   │   └── services/         # API services
│   └── index.html
├── docs/                     # Documentation
└── config/                   # External configuration
    └── database.json         # Database credentials
```

## Key Features

1. **Authentication System**
   - JWT-based authentication
   - Secure password hashing (bcrypt, 12 rounds)
   - Protected routes
   - Pre-seeded admin superuser

2. **User Management Module** (`/modules/users/`)
   - Complete CRUD operations
   - Role-based access (user, admin, superuser)
   - Cannot delete last superuser
   - Cannot delete own account

3. **Content Management System** (`/modules/content/`)
   - Three content types: Articles, Pages, Photo Books
   - Single table inheritance pattern
   - Draft/Published/Archived workflow
   - Metadata storage for extensibility

4. **Reusable UI Components**
   - Header with navigation menu
   - Footer with links
   - AdminLayout wrapper
   - Modal forms
   - Alert notifications

## Database Schema

### Users Table
- id (UUID, primary key)
- username (unique)
- passwordHash
- role (user|admin|superuser)
- createdAt, updatedAt

### Content Table (Single Table Inheritance)
- id (UUID, primary key)
- title
- slug (unique, auto-generated)
- body (text content)
- status (draft|published|archived)
- contentType (article|page|photoBook)
- authorId (foreign key to users)
- publishedAt
- metadata (JSONB for type-specific data)
- parentId (for page hierarchy)
- createdAt, updatedAt

## API Endpoints

### Authentication
- POST `/api/auth/login` - User login

### Users (Protected - Admin only)
- GET `/api/users` - List all users
- GET `/api/users/:id` - Get single user
- POST `/api/users` - Create user
- PUT `/api/users/:id` - Update user
- DELETE `/api/users/:id` - Delete user

### Content
Public endpoints:
- GET `/api/content/articles` - List articles
- GET `/api/content/articles/:id` - Get article
- GET `/api/content/articles/slug/:slug` - Get article by slug

Protected endpoints (Admin only):
- POST `/api/content/articles` - Create article
- PUT `/api/content/articles/:id` - Update article
- DELETE `/api/content/articles/:id` - Delete article

(Similar endpoints exist for pages and photo-books)

## Getting Started

### Prerequisites
- Node.js (v14+)
- PostgreSQL
- npm

### Backend Setup
```bash
cd backend
npm install
# Configure database in /var/www/config/database.json
npm start
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### Default Credentials
- Username: `admin`
- Password: `(130Bpm)`

## Development Notes

### Environment Variables
- `NODE_ENV` - Set to 'production' for production mode
- `JWT_SECRET` - Secret key for JWT tokens (defaults to dev key)
- `PORT` - Server port (defaults to 5001)

### Database Configuration
Database credentials are stored in `/var/www/config/database.json` outside the webroot for security. The file contains settings for both development and production environments.

### Production Deployment
In production mode (`NODE_ENV=production`), the Express server serves the built React app from `/var/www/public_html/`.

## Security Considerations

1. **Authentication**
   - JWT tokens expire after 1 hour
   - Passwords hashed with bcrypt (12 rounds)
   - Token required for all admin operations

2. **Database**
   - Credentials stored outside webroot
   - Parameterized queries prevent SQL injection
   - UUID primary keys

3. **Middleware**
   - CORS enabled
   - JSON body parsing
   - Protected routes require authentication

## Troubleshooting

### Backend won't start
- Check PostgreSQL is running: `sudo systemctl status postgresql`
- Verify database exists: `sudo -u postgres psql -l`
- Check database credentials in `/var/www/config/database.json`

### Can't login
- Ensure backend is running on port 5001
- Check browser console for errors
- Verify credentials: admin / (130Bpm)

### Frontend proxy errors
- Backend must be running before frontend
- Check backend logs for errors
- Ensure ports 5001 (backend) and 5173 (frontend dev) are available

## Future Enhancements

1. **Photo Books**
   - Gallery implementation
   - Image upload functionality
   - Album organization

2. **Content Features**
   - Rich text editor
   - Media library
   - SEO optimization
   - Content versioning

3. **User Features**
   - Password reset
   - Email notifications
   - Activity logging
   - Two-factor authentication
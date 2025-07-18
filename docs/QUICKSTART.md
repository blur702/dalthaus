# Quick Start Guide

## For the Next Claude Code Instance

### Current System State

You're working with a full-stack admin panel application that's already built and functional. Here's what exists:

#### Backend (Port 5001)
- Node.js/Express API server
- PostgreSQL database with Sequelize ORM
- JWT authentication
- User management system
- Content management system (Articles, Pages, Photo Books)

#### Frontend (Port 5173 in dev)
- React with Vite
- Modular architecture
- Reusable components
- Protected routes

### Essential Information

**Default Admin Credentials:**
- Username: `admin`
- Password: `(130Bpm)`

**Database Config Location:**
`/var/www/config/database.json`

**Project Root:**
`/var/www/public_html/`

### Common Commands You'll Need

```bash
# Check if services are running
ps aux | grep node

# Start backend (from project root)
cd backend && npm start

# Start frontend dev server
cd frontend && npm run dev

# Database access
sudo -u postgres psql -d admin_db

# View logs
tail -f backend/backend.log
```

### Current Features

1. **Authentication System**
   - JWT tokens (1 hour expiry)
   - Protected routes
   - Role-based access (user/admin/superuser)

2. **User Management** (`/admin/users`)
   - CRUD operations
   - Cannot delete self or last superuser
   - Role management

3. **Content Management**
   - Articles (`/admin/content/articles`)
   - Pages (`/admin/content/pages`)  
   - Photo Books (`/admin/content/photo-books`)
   - Draft/Published/Archived workflow

### Quick Tasks

#### Add a New API Endpoint
1. Create controller in `/backend/src/controllers/`
2. Create route in `/backend/src/routes/`
3. Register route in `server.js`

#### Add a New Page
1. Create component in `/frontend/src/pages/`
2. Add route in `App.jsx`
3. Update navigation in `Header.jsx`

#### Create New Content Type
1. Update contentType enum in `baseContent.model.js`
2. Create filtered model class
3. Create controller and routes
4. Add frontend components

### File Locations

**Key Backend Files:**
- `/backend/server.js` - Main server file
- `/backend/src/config/database.js` - DB connection
- `/backend/src/models/` - Database models
- `/backend/src/controllers/` - Business logic
- `/backend/src/routes/` - API endpoints

**Key Frontend Files:**
- `/frontend/src/App.jsx` - Main app with routes
- `/frontend/src/components/Header.jsx` - Navigation
- `/frontend/src/modules/` - Feature modules
- `/frontend/src/services/api.js` - API service

### Architecture Notes

- **Single Table Inheritance**: All content types use one `content` table
- **Modular Structure**: Features are isolated in modules
- **JWT Authentication**: Token required for admin operations
- **Separation of Concerns**: Backend API + Frontend SPA

### Troubleshooting First Steps

1. **Can't login?**
   - Check backend is running on port 5001
   - Verify database is accessible
   - Use correct credentials

2. **API errors?**
   - Check browser console
   - Verify token in Authorization header
   - Check backend logs

3. **Database issues?**
   - Verify PostgreSQL is running
   - Check credentials in config file
   - Ensure database exists

### What's Next?

**Immediate priorities:**
1. Photo Books need gallery implementation
2. Rich text editor for content
3. Image upload functionality
4. Email notifications
5. Activity logging

**Code is ready to extend** - all base functionality is working!
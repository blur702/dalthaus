# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a full-featured Content Management System (CMS) with three main components:
- **Backend API**: Node.js/Express server on port 5001
- **Frontend**: React + Vite application on port 5173 (serves both admin and public views)
- **Document Converter**: Python FastAPI service on port 8000

## Essential Commands

### Development Setup & Running

```bash
# Backend
cd public_html/backend
npm install
npm run dev      # Development with nodemon
npm start        # Production mode

# Frontend  
cd public_html/frontend
npm install
npm run dev      # Starts on http://localhost:5173

# Document Converter (optional)
cd public_html/document-converter
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python main.py   # Starts on http://localhost:8000
```

### Testing

```bash
# Run Playwright E2E tests with browser (always use for debugging)
cd playwright-tests
npm run test:headed

# Run specific test file
npx playwright test tests/demo/your-test.spec.js --headed

# Frontend unit tests
cd public_html/frontend
npm test
```

### Building

```bash
# Frontend production build
cd public_html/frontend
npm run build

# The build outputs to frontend/dist/
```

## Architecture & Key Concepts

### Database Design
- Uses **Single Table Inheritance** pattern - all content types (Articles, Pages, Photo Books) share one `BaseContent` table
- Content is filtered by `contentType` field to create virtual models
- PostgreSQL with Sequelize ORM
- Automatic migrations on server start

### Authentication
- JWT-based authentication (tokens stored in localStorage)
- Default admin credentials: `admin` / `(130Bpm)`
- Two roles: `user` and `superuser`
- Protected routes require `protect` middleware

### Content Management
- Three content types: Articles, Pages, Photo Books
- Rich text editing with TinyMCE
- Draft/Published/Archived workflow
- Parent-child relationships for hierarchical pages
- Cover image support (upload or URL)
- Automatic slug generation from titles

### File Structure
```
/var/www/
├── public_html/
│   ├── backend/           # Express API server
│   │   ├── src/
│   │   │   ├── controllers/   # Business logic
│   │   │   ├── models/        # Sequelize models
│   │   │   ├── routes/        # API endpoints
│   │   │   └── middleware/    # Auth & validation
│   │   └── server.js          # Entry point
│   ├── frontend/          # React frontend (admin + public)
│   │   ├── src/
│   │   │   ├── modules/       # Feature modules
│   │   │   ├── components/    # Reusable UI
│   │   │   └── services/      # API client
│   │   └── vite.config.js
│   └── public-frontend/   # Public website
└── playwright-tests/      # E2E test suite
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - Login with username/password
- `GET /api/auth/verify` - Verify JWT token

### Content Management
- `GET /api/content/{type}` - List content (articles/pages/photo-books)
- `POST /api/content/{type}` - Create new content
- `PUT /api/content/{type}/:id` - Update content
- `DELETE /api/content/{type}/:id` - Delete content

### File Upload
- `POST /api/upload/image` - Upload cover images
- Files stored in `/uploads/images/`

### TinyMCE Settings
- Full CRUD for editor configurations at `/api/admin/tinymce-settings`
- Import/export settings as JSON

## Key Implementation Details

### TinyMCE Integration
- Editor configured in `RichTextEditor.jsx`
- Custom pagebreak plugin for document separation
- Image uploads converted to base64
- Multiple configuration presets available

### Environment Variables
Backend requires `.env` file:
```env
JWT_SECRET=your-secret-key
NODE_ENV=development
PORT=5001
```

### Database Configuration
Update `/var/www/config/database.json` with PostgreSQL credentials

### Testing Patterns
- Always use `--headed` flag for Playwright tests
- Use `authenticatedPage` fixture for logged-in state
- Monitor and fix console errors during tests
- Demo tests in `tests/demo/` for visual debugging

## Common Tasks

### Adding a New Content Type
1. Add to `contentType` enum in BaseContent model
2. Create new model extending BaseContent
3. Create controller extending BaseContentController  
4. Add routes file
5. Add frontend UI components

### Debugging TinyMCE Issues
- Check if TinyMCE files are in `frontend/public/tinymce/`
- Add `await page.waitForTimeout(2000)` after navigation
- Verify iframe selector: `.tox-edit-area__iframe`

### Running Document Conversion
1. Ensure Python service is running on port 8000
2. Upload .docx/.odt files through UI
3. Images extracted to `/media/` directory
4. HTML preserves formatting and pagebreaks

## Security Notes
- Never commit `.env` files
- JWT secret must be strong and random in production
- All user inputs are sanitized
- Passwords hashed with bcrypt
- CORS configured for development ports
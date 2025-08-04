# Changelog

## [Unreleased]

### Added - Cover Image Feature
- **Backend Changes:**
  - Added `coverImageUrl` field to BaseContent model (`backend/src/models/content/baseContent.model.js`)
  - Created new upload endpoint `/api/upload/image` for image file uploads (`backend/src/routes/upload.routes.js`)
  - Configured Multer for handling multipart form data with image validation
  - Added validation for both URL and file path formats in the model
  - Set up static file serving for uploaded images at `/uploads` path

- **Frontend Admin Panel Changes:**
  - Added cover image upload UI in ContentEditor component (`frontend/src/modules/content/components/ContentEditor.jsx`)
  - Implemented both file upload and URL input options
  - Added real-time preview of selected cover images
  - File upload uses FormData API to send images to backend
  - Supports Articles and PhotoBooks content types

- **Public Frontend Changes:**
  - Updated article and photobook detail pages to display cover images (`public-frontend/js/main.js`)
  - Implemented full-size cover image display between title and content
  - Added responsive CSS styles for cover images (`public-frontend/css/style.css`)
  - Fixed image error handling to show images with reduced opacity instead of hiding
  - Configured static file serving in public frontend Express server

### Fixed
- **Pagebreak Test Issues:**
  - Fixed incorrect test selectors in pagebreak functionality tests
  - Pagebreak feature was working correctly; only tests needed updating

- **Image Display Issues:**
  - Fixed aggressive onerror handler that was hiding valid images
  - Resolved path issues between frontend (port 5173) and backend (port 5001)
  - Updated static file serving configuration in both backend and public frontend servers
  - Changed error handling from `display='none'` to `opacity='0.5'` for better debugging

- **Authentication Middleware:**
  - Fixed undefined authMiddleware error by using correct `protect` middleware

- **Database Migration:**
  - Added missing `coverImageUrl` column to content tables via ALTER TABLE command

### Technical Details
- **Image Upload Flow:**
  1. User selects image file or enters URL in admin panel
  2. File uploads go to `/uploads/images/` directory with timestamp-based naming
  3. Backend returns relative path (e.g., `/uploads/images/1234567890-image.jpg`)
  4. Path is saved in database `coverImageUrl` field
  5. Public frontend fetches image using the stored path

- **Static File Configuration:**
  - Backend serves `/uploads` directory at `http://localhost:5001/uploads`
  - Public frontend serves same directory at `http://localhost:3000/uploads`
  - Vite dev server proxies `/uploads` requests to backend

### Testing
- Created comprehensive Playwright tests for cover image functionality
- Manual testing performed with images from `/additional-info` directory
- Verified image display on both admin preview and public frontend
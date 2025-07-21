# Admin Panel CMS

A modern, full-featured Content Management System (CMS) with rich text editing capabilities, document conversion, and comprehensive user management.

## Features

### 🔐 Authentication & Authorization
- JWT-based authentication with 7-day token expiration
- Role-based access control (user, superuser)
- Protected routes with automatic token validation
- Session persistence with localStorage

### 👥 User Management
- Complete CRUD operations for users
- Role assignment and management
- User search and pagination
- Bulk operations support

### 📄 Content Management System
- Three content types: Articles, Pages, Photo Books
- Rich text editing with TinyMCE
- Draft/Published/Archived workflow
- SEO-friendly slug generation
- Automatic pagebreak detection and page counting
- Content preview functionality
- Parent-child relationships for hierarchical content

### ✏️ Rich Text Editor (TinyMCE)
- Full-featured WYSIWYG editor
- Multiple plugins: formatting, lists, links, images, tables, media, pagebreak
- Custom pagebreak implementation with visual representation
- Image upload support with base64 encoding
- Configurable editor settings

### ⚙️ TinyMCE Settings Management
- Create and manage custom editor configurations
- 5 pre-configured presets (Basic, Full Featured, Blog Post, Email Template, Documentation)
- Live preview of configurations
- Import/Export settings as JSON
- Tag-based organization
- Set default configurations

### 📎 Document Conversion Service
- Convert Word (.docx, .doc), OpenDocument (.odt), and RTF files to HTML
- Preserves formatting and styles
- Image extraction and storage
- Python-based microservice using FastAPI

### 🛡️ Security Features
- Password hashing with bcrypt
- Environment-based JWT secret configuration
- CORS configuration
- Input validation and sanitization
- SQL injection prevention via Sequelize ORM
- Error boundaries for React components

## Tech Stack

### Frontend
- **React 18** - UI library
- **React Router v6** - Client-side routing
- **Vite** - Build tool and dev server
- **Axios** - HTTP client
- **TinyMCE React** - Rich text editor

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **PostgreSQL** - Database
- **Sequelize** - ORM
- **JWT** - Authentication
- **bcrypt** - Password hashing
- **Multer** - File uploads

### Document Converter (Python Microservice)
- **FastAPI** - Web framework
- **python-docx** - Word document processing
- **odfpy** - OpenDocument processing
- **striprtf** - RTF processing
- **BeautifulSoup4** - HTML processing

## Installation

### Prerequisites
- Node.js (v18 or higher)
- PostgreSQL (v12 or higher)
- Python 3.8+ (for document converter)

### Backend Setup

1. Clone the repository:
```bash
git clone [repository-url]
cd admin-panel/backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```env
JWT_SECRET=your-secret-key-here
NODE_ENV=development
PORT=5001
```

4. Configure database in `/var/www/config/database.json`

5. Start the server:
```bash
npm start
```

The backend will:
- Connect to PostgreSQL
- Run database migrations
- Seed admin user (username: admin, password: (130Bpm))
- Seed TinyMCE presets
- Start on port 5001

### Frontend Setup

1. Navigate to frontend:
```bash
cd ../frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start development server:
```bash
npm run dev
```

The frontend will start on http://localhost:5173

### Document Converter Setup (Optional)

1. Navigate to converter:
```bash
cd ../backend/src/services/documentConverter
```

2. Create virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Start the service:
```bash
python converter_service.py
```

The converter will start on http://localhost:8001

## Development

### Available Scripts

#### Frontend
- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

#### Backend
- `npm start` - Start production server
- `npm run dev` - Start with nodemon for development

### Project Structure

```
/var/www/public_html/
├── frontend/
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── modules/        # Feature modules
│   │   │   ├── content/    # Content management
│   │   │   ├── settings/   # Settings management
│   │   │   └── users/      # User management
│   │   ├── pages/          # Page components
│   │   ├── services/       # API services
│   │   └── App.jsx         # Root component
│   └── public/             # Static assets
├── backend/
│   ├── src/
│   │   ├── config/         # Database config
│   │   ├── controllers/    # Route handlers
│   │   ├── middleware/     # Express middleware
│   │   ├── models/         # Sequelize models
│   │   ├── routes/         # API routes
│   │   ├── services/       # Business logic
│   │   └── utils/          # Utilities
│   └── server.js           # Entry point
└── test-suite/             # Test files
```

## API Documentation

### Authentication
- `POST /api/auth/login` - User login
- `GET /api/auth/verify` - Verify token

### Users
- `GET /api/users` - List users (paginated)
- `GET /api/users/:id` - Get user details
- `POST /api/users` - Create user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Content (Articles, Pages, Photo Books)
- `GET /api/content/{type}` - List content
- `GET /api/content/{type}/:id` - Get content
- `POST /api/content/{type}` - Create content
- `PUT /api/content/{type}/:id` - Update content
- `DELETE /api/content/{type}/:id` - Delete content

### TinyMCE Settings
- `GET /api/admin/tinymce-settings` - List settings
- `GET /api/admin/tinymce-settings/:id` - Get setting
- `POST /api/admin/tinymce-settings` - Create setting
- `PUT /api/admin/tinymce-settings/:id` - Update setting
- `DELETE /api/admin/tinymce-settings/:id` - Delete setting
- `GET /api/admin/tinymce-settings/:id/export` - Export setting
- `POST /api/admin/tinymce-settings/import` - Import setting

### Document Conversion
- `POST /api/document/convert` - Convert document to HTML
- `GET /api/document/formats` - Get supported formats
- `GET /api/document/health` - Check service health

## Testing

A comprehensive test suite is available in `/test-suite/comprehensive-tests.js` using Playwright.

To run tests:
```bash
cd test-suite
npm install playwright
npx playwright install chromium
node comprehensive-tests.js
```

## Production Deployment

1. Build frontend:
```bash
cd frontend
npm run build
```

2. Set environment variables:
```bash
export NODE_ENV=production
export JWT_SECRET=secure-random-key
```

3. Start backend:
```bash
cd backend
npm start
```

4. Configure reverse proxy (nginx) to:
   - Serve frontend build files
   - Proxy `/api` requests to backend

## Security Considerations

1. **Environment Variables**: Never commit `.env` files
2. **JWT Secret**: Use a strong, random secret in production
3. **Database**: Use strong passwords and limit access
4. **HTTPS**: Always use HTTPS in production
5. **CORS**: Configure appropriate origins
6. **File Uploads**: Validate file types and sizes

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests
5. Submit a pull request

## License

[Your License Here]

## Support

For issues and questions, please use the GitHub issue tracker.
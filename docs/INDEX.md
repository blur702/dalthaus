# Documentation Index

Welcome to the Admin Panel documentation. This documentation is designed to help the next Claude Code instance understand and work with the existing codebase.

## 📚 Documentation Files

### 1. [QUICKSTART.md](./QUICKSTART.md)
**Start Here!** - Essential information for getting up to speed quickly
- Current system state
- Key credentials and locations
- Common commands
- Quick task guides

### 2. [README.md](./README.md)
Comprehensive project overview
- Technology stack
- Feature list
- Project structure
- Getting started guide
- API endpoints summary

### 3. [ARCHITECTURE.md](./ARCHITECTURE.md)
Deep dive into system design
- Design principles
- Backend architecture
- Frontend architecture
- Security architecture
- Data flow examples

### 4. [API_REFERENCE.md](./API_REFERENCE.md)
Complete API documentation
- Authentication endpoints
- User management endpoints
- Content management endpoints
- Request/response examples
- Error codes

### 5. [DEVELOPMENT_GUIDE.md](./DEVELOPMENT_GUIDE.md)
Developer handbook
- Setting up development environment
- Development workflow
- Code style guidelines
- Common development tasks
- Testing approaches

### 6. [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)
Problem-solving guide
- Common issues and solutions
- Debugging tips
- Quick fixes
- Health check procedures

## 🚀 Quick Navigation

### For Immediate Tasks
- Need to start coding? → [QUICKSTART.md](./QUICKSTART.md)
- System won't start? → [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)
- Adding new features? → [DEVELOPMENT_GUIDE.md](./DEVELOPMENT_GUIDE.md)

### For Understanding
- How does it work? → [ARCHITECTURE.md](./ARCHITECTURE.md)
- What can it do? → [README.md](./README.md)
- API details? → [API_REFERENCE.md](./API_REFERENCE.md)

## 💡 Key Points to Remember

1. **The system is fully functional** - Authentication, user management, and content management all work
2. **Modular architecture** - Features are isolated for easy extension
3. **Security is implemented** - JWT auth, role-based access, password hashing
4. **Database uses single table inheritance** - All content types share one table
5. **Frontend and backend are separate** - API on port 5001, dev frontend on 5173

## 🔑 Critical Information

- **Admin Login**: username: `admin`, password: `(130Bpm)`
- **Database Config**: `/var/www/config/database.json`
- **Project Root**: `/var/www/public_html/`
- **Backend Port**: 5001
- **Frontend Dev Port**: 5173

## 📝 Summary for Next Instance

You're inheriting a well-structured, working admin panel with:
- Secure authentication system
- Complete user management
- Flexible content management system
- Modular, extensible architecture
- Comprehensive documentation

The foundation is solid and ready for enhancement. Check QUICKSTART.md to begin!
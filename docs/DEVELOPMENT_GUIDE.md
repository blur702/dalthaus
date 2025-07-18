# Development Guide

## Setting Up Development Environment

### Prerequisites
- Node.js 14+ and npm
- PostgreSQL 12+
- Git
- Text editor (VS Code recommended)

### Initial Setup

1. **Clone/Access the repository**
   ```bash
   cd /var/www/public_html
   ```

2. **Database Setup**
   ```bash
   # Create database
   sudo -u postgres psql
   CREATE DATABASE admin_db;
   CREATE USER your_user WITH PASSWORD 'your_password';
   GRANT ALL PRIVILEGES ON DATABASE admin_db TO your_user;
   \q
   ```

3. **Configure Database**
   Edit `/var/www/config/database.json`:
   ```json
   {
     "development": {
       "host": "localhost",
       "port": 5432,
       "database": "admin_db",
       "username": "your_user",
       "password": "your_password"
     }
   }
   ```

4. **Install Dependencies**
   ```bash
   # Backend
   cd backend
   npm install
   
   # Frontend
   cd ../frontend
   npm install
   ```

5. **Start Development Servers**
   ```bash
   # Terminal 1 - Backend
   cd backend
   npm run dev
   
   # Terminal 2 - Frontend
   cd frontend
   npm run dev
   ```

## Development Workflow

### Adding a New Feature

1. **Plan the feature**
   - Define models/schema
   - Plan API endpoints
   - Design UI components

2. **Backend Implementation**
   - Create/update models
   - Add controllers
   - Define routes
   - Test with Postman/curl

3. **Frontend Implementation**
   - Create service methods
   - Build components
   - Add pages
   - Update navigation

4. **Testing**
   - Test API endpoints
   - Test UI functionality
   - Check error handling

### Code Style Guidelines

#### JavaScript/React
- Use ES6+ features
- Functional components with hooks
- Async/await over promises
- Meaningful variable names
- Comment complex logic

#### File Naming
- Components: PascalCase (UserList.jsx)
- Services: camelCase (userService.js)
- Routes: kebab-case (user.routes.js)
- Models: camelCase (user.model.js)

#### Git Commits
- Clear, descriptive messages
- Reference issue numbers
- Group related changes

## Common Tasks

### Adding a New Model

1. Create model file in `/backend/src/models/`
2. Define schema with Sequelize
3. Add associations if needed
4. Import in server.js

Example:
```javascript
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const MyModel = sequelize.define('MyModel', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  }
});

module.exports = MyModel;
```

### Creating an API Endpoint

1. Create controller in `/backend/src/controllers/`
2. Create routes in `/backend/src/routes/`
3. Register routes in server.js

Example Controller:
```javascript
const getAll = async (req, res) => {
  try {
    const items = await MyModel.findAll();
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = { getAll };
```

### Adding a Frontend Page

1. Create page component in `/frontend/src/pages/`
2. Add route in App.jsx
3. Update navigation if needed

Example:
```jsx
import React from 'react';
import AdminLayout from '../components/AdminLayout';

const MyPage = ({ setIsAuthenticated }) => {
  return (
    <AdminLayout setIsAuthenticated={setIsAuthenticated}>
      <h2>My Page</h2>
    </AdminLayout>
  );
};

export default MyPage;
```

## Debugging

### Backend Debugging

1. **Check logs**
   ```bash
   # Development logs appear in terminal
   # Add console.log() statements
   ```

2. **Database queries**
   ```javascript
   // Enable Sequelize logging
   logging: console.log
   ```

3. **API testing**
   ```bash
   # Test endpoints with curl
   curl -X POST http://localhost:5001/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"username":"admin","password":"(130Bpm)"}'
   ```

### Frontend Debugging

1. **Browser DevTools**
   - Console for errors
   - Network tab for API calls
   - React DevTools extension

2. **Common issues**
   - Check if backend is running
   - Verify API endpoints
   - Check authentication token

## Database Management

### Migrations
Currently using Sequelize sync. For production, consider migrations:

```javascript
// Example migration
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('MyTable', {
      id: {
        type: Sequelize.UUID,
        primaryKey: true
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('MyTable');
  }
};
```

### Seeding Data
```javascript
// Create seed file
const bcryptjs = require('bcryptjs');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const hashedPassword = await bcryptjs.hash('password', 12);
    await queryInterface.bulkInsert('Users', [{
      id: Sequelize.fn('gen_random_uuid'),
      username: 'testuser',
      passwordHash: hashedPassword,
      role: 'admin',
      createdAt: new Date(),
      updatedAt: new Date()
    }]);
  }
};
```

## Testing

### Manual Testing Checklist

#### Authentication
- [ ] Login with valid credentials
- [ ] Login with invalid credentials
- [ ] Token expiration
- [ ] Protected route access

#### User Management
- [ ] Create user (unique username)
- [ ] Update user details
- [ ] Delete user (not self/last superuser)
- [ ] List users with pagination

#### Content Management
- [ ] Create content (all types)
- [ ] Update content
- [ ] Delete content
- [ ] View published content
- [ ] Search functionality

### Automated Testing (Future)
```javascript
// Example test structure
describe('User API', () => {
  test('should create a new user', async () => {
    const response = await request(app)
      .post('/api/users')
      .set('Authorization', `Bearer ${token}`)
      .send({
        username: 'testuser',
        password: 'password'
      });
    
    expect(response.status).toBe(201);
    expect(response.body.user.username).toBe('testuser');
  });
});
```

## Performance Optimization

### Backend
- Use database indexes
- Implement caching
- Optimize queries
- Use pagination

### Frontend
- Lazy load components
- Optimize images
- Minimize bundle size
- Use React.memo for expensive components

## Security Best Practices

1. **Never commit secrets**
   - Use environment variables
   - Keep config files outside repository

2. **Validate all input**
   - Sanitize user input
   - Use parameterized queries
   - Validate on both frontend and backend

3. **Keep dependencies updated**
   ```bash
   npm audit
   npm audit fix
   ```

4. **Use HTTPS in production**
   - SSL certificates
   - Secure cookies
   - HSTS headers
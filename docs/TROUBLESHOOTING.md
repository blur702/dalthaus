# Troubleshooting Guide

## Common Issues and Solutions

### Backend Issues

#### Backend won't start

**Error: "Unable to connect to database"**
```bash
# Check PostgreSQL is running
sudo systemctl status postgresql

# Start if needed
sudo systemctl start postgresql

# Check database exists
sudo -u postgres psql -l | grep admin_db
```

**Error: "SequelizeDatabaseError"**
- Check database credentials in `/var/www/config/database.json`
- Ensure database user has proper permissions
- Try connecting manually:
  ```bash
  psql -h localhost -U your_user -d admin_db
  ```

**Port already in use**
```bash
# Find process using port 5001
lsof -i :5001
# Or
ps aux | grep node

# Kill the process
kill -9 <PID>
```

### Frontend Issues

#### Can't reach localhost:5173

**Connection refused**
- Ensure frontend dev server is running
- Check if backend is running (port 5001)
- Try accessing backend directly: http://localhost:5001

**Proxy errors**
```
[vite] http proxy error: /api/auth/login
Error: connect ECONNREFUSED 127.0.0.1:5001
```
- Backend must be running before frontend
- Check backend logs for errors

#### Login Issues

**"Invalid username or password"**
- Default credentials: admin / (130Bpm)
- Check caps lock
- Verify user exists in database:
  ```sql
  sudo -u postgres psql -d admin_db
  SELECT username, role FROM "Users";
  ```

**Token errors**
- Clear browser localStorage
- Check token expiration (1 hour)
- Verify JWT_SECRET matches between requests

### Database Issues

#### Migration/Sync Errors

**Foreign key constraint errors**
```sql
-- Drop all tables and recreate
sudo -u postgres psql -d admin_db
DROP TABLE IF EXISTS content CASCADE;
DROP TABLE IF EXISTS "Users" CASCADE;
```

**Column already exists**
- Database schema out of sync
- Drop and recreate tables
- Or manually alter:
  ```sql
  ALTER TABLE content DROP COLUMN column_name;
  ```

### Development Environment

#### WSL/Windows Issues

**Can't access from Windows browser**
```bash
# Get WSL IP
hostname -I

# Access via WSL IP
http://172.x.x.x:5173
```

**Permission denied errors**
```bash
# Fix ownership
sudo chown -R $USER:$USER /var/www/public_html

# Fix permissions
chmod -R 755 /var/www/public_html
```

### API Issues

#### 401 Unauthorized
- Token missing or expired
- Check Authorization header format: `Bearer <token>`
- Verify token in browser DevTools Network tab

#### 403 Forbidden
- User doesn't have required role
- Check user role in database
- Verify middleware is checking correct role

#### 404 Not Found
- Check API endpoint URL
- Verify route is registered in server.js
- Check for typos in URL

#### 500 Internal Server Error
- Check backend console for detailed error
- Common causes:
  - Database connection issues
  - Missing required fields
  - Validation errors

### Content Management Issues

#### Can't create content
- Ensure you're logged in as admin/superuser
- Check all required fields are filled
- Verify slug is unique
- Check browser console for errors

#### Content not saving
- Check metadata field format (must be valid JSON)
- Verify database connection
- Check for validation errors in response

### Quick Fixes

#### Reset Everything
```bash
# Stop all services
pkill node

# Reset database
sudo -u postgres psql -d admin_db -c "DROP SCHEMA public CASCADE; CREATE SCHEMA public;"

# Restart backend
cd backend && npm start

# Restart frontend
cd frontend && npm run dev
```

#### Clear Application State
```javascript
// In browser console
localStorage.clear();
location.reload();
```

#### Check System Status
```bash
# Check what's running
ps aux | grep -E "node|vite"

# Check ports
netstat -tulpn | grep -E "5001|5173"
# or
ss -tulpn | grep -E "5001|5173"

# Check logs
tail -f backend/backend.log
tail -f frontend/frontend.log
```

### Debugging Tips

1. **Enable verbose logging**
   ```javascript
   // In database config
   logging: console.log
   ```

2. **Check browser console**
   - Network tab for failed requests
   - Console for JavaScript errors
   - Application tab for localStorage

3. **Test API endpoints directly**
   ```bash
   # Get auth token
   TOKEN=$(curl -X POST http://localhost:5001/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"username":"admin","password":"(130Bpm)"}' \
     | jq -r '.token')

   # Test protected endpoint
   curl -H "Authorization: Bearer $TOKEN" \
     http://localhost:5001/api/users
   ```

4. **Database queries**
   ```sql
   -- Check all users
   SELECT * FROM "Users";
   
   -- Check content
   SELECT id, title, "contentType", status FROM content;
   
   -- Check specific content type
   SELECT * FROM content WHERE "contentType" = 'article';
   ```

### Getting Help

If issues persist:

1. Check error messages carefully
2. Look for similar issues in docs
3. Verify all prerequisites are installed
4. Check file permissions
5. Try with a fresh database
6. Review recent changes in git log

### Health Check Script

Create a quick health check:
```bash
#!/bin/bash
echo "Checking system health..."

# Check PostgreSQL
if systemctl is-active --quiet postgresql; then
    echo "✓ PostgreSQL is running"
else
    echo "✗ PostgreSQL is not running"
fi

# Check backend
if curl -s http://localhost:5001 > /dev/null; then
    echo "✓ Backend is running"
else
    echo "✗ Backend is not running"
fi

# Check frontend
if curl -s http://localhost:5173 > /dev/null; then
    echo "✓ Frontend is running"
else
    echo "✗ Frontend is not running"
fi

# Check database connection
if PGPASSWORD=password psql -h localhost -U kevin -d admin_db -c '\q' 2>/dev/null; then
    echo "✓ Database connection OK"
else
    echo "✗ Database connection failed"
fi
```
# Production Deployment Guide

## Overview
This guide covers deploying the CMS to production using a single-port configuration (port 5001) that doesn't require root privileges.

## Server Requirements
- Node.js 16+ 
- PostgreSQL 12+
- Git
- 2GB+ RAM recommended
- Non-root user account

## Deployment Steps

### 1. Clone Repository
```bash
# Clone via HTTPS (recommended for servers)
git clone https://github.com/blur702/dalthaus.git /path/to/deployment

# Or if deploying directly to public_html
cd /var/www
git clone https://github.com/blur702/dalthaus.git public_html_new
mv public_html public_html_old
mv public_html_new public_html
```

### 2. Database Setup
```bash
# Create PostgreSQL database and user
sudo -u postgres psql

CREATE DATABASE cms_production;
CREATE USER cms_user WITH PASSWORD 'your-secure-password';
GRANT ALL PRIVILEGES ON DATABASE cms_production TO cms_user;
\q
```

### 3. Environment Configuration
```bash
cd /var/www/public_html

# Copy production environment template
cp .env.production backend/.env

# Edit with your actual values
nano backend/.env

# Required changes:
# - JWT_SECRET: Generate secure random string
# - DB_PASSWORD: Your PostgreSQL password
# - FRONTEND_URL: Your domain
```

### 4. Install Dependencies
```bash
# Backend dependencies
cd backend
npm install --production

# Frontend is pre-built in dist/
# No need to install frontend dependencies in production
```

### 5. Start Production Server
```bash
# From backend directory
NODE_ENV=production npm start

# Or use PM2 for process management (recommended)
npm install -g pm2
pm2 start server.js --name cms-backend
pm2 save
pm2 startup
```

### 6. Nginx Configuration (Recommended)
If using Nginx as reverse proxy:

```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:5001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Increase max upload size for images
    client_max_body_size 10M;
}
```

### 7. SSL/HTTPS Setup
```bash
# Using Let's Encrypt
sudo certbot --nginx -d yourdomain.com
```

## Production Configuration

### Single Port Deployment
The application runs on port 5001 and serves:
- Backend API at `/api/*`
- Frontend static files from `/frontend/dist/*`
- Uploaded files from `/uploads/*`

### Environment Variables
Key production settings in `.env`:

```env
NODE_ENV=production
PORT=5001
JWT_SECRET=<generate-secure-random-string>
DB_HOST=localhost
DB_NAME=cms_production
DB_USER=cms_user
DB_PASSWORD=<your-database-password>
FRONTEND_URL=https://yourdomain.com
```

### Security Checklist
- [ ] Change default admin password after first login
- [ ] Use strong JWT_SECRET (minimum 32 characters)
- [ ] Configure HTTPS/SSL
- [ ] Set up firewall rules
- [ ] Regular database backups
- [ ] Monitor server logs
- [ ] Keep dependencies updated

## Updating Production

### Pull Latest Changes
```bash
cd /var/www/public_html
git pull origin master

# If frontend changed, rebuild locally and push
# Backend changes take effect after restart
```

### Restart Server
```bash
# If using PM2
pm2 restart cms-backend

# If using systemd
sudo systemctl restart cms-backend
```

### Database Migrations
Database schema updates are applied automatically on server start via Sequelize sync.

## Troubleshooting

### Port Already in Use
```bash
# Find process using port 5001
lsof -i :5001
# Or
netstat -tulpn | grep 5001

# Kill process if needed
kill -9 <PID>
```

### Permission Errors
```bash
# Ensure upload directory is writable
chmod 755 uploads
chmod 755 uploads/images
chmod 755 uploads/lightbox
```

### Database Connection Issues
- Verify PostgreSQL is running: `systemctl status postgresql`
- Check credentials in `.env`
- Ensure database exists and user has permissions

### Frontend Not Loading
- Check that `frontend/dist` exists and contains built files
- Verify Express static middleware is configured correctly
- Check browser console for errors

## Monitoring

### Application Logs
```bash
# PM2 logs
pm2 logs cms-backend

# Or if running directly
tail -f backend/logs/app.log
```

### System Resources
```bash
# Memory usage
free -h

# Disk usage
df -h

# Process monitoring
htop
```

## Backup Strategy

### Database Backup
```bash
# Create backup
pg_dump -U cms_user cms_production > backup_$(date +%Y%m%d).sql

# Restore backup
psql -U cms_user cms_production < backup_20240101.sql
```

### File Backup
```bash
# Backup uploads directory
tar -czf uploads_backup_$(date +%Y%m%d).tar.gz uploads/

# Backup entire application
tar -czf cms_backup_$(date +%Y%m%d).tar.gz \
  --exclude=node_modules \
  --exclude=.git \
  /var/www/public_html
```

## Performance Optimization

### Node.js Settings
```bash
# Increase memory limit if needed
NODE_OPTIONS="--max-old-space-size=2048" npm start
```

### Database Optimization
```sql
-- Add indexes for common queries
CREATE INDEX idx_content_status ON "BaseContent"("status");
CREATE INDEX idx_content_type ON "BaseContent"("contentType");
CREATE INDEX idx_content_order ON "BaseContent"("orderIndex");
```

### Caching
Consider implementing:
- Redis for session storage
- CDN for static assets
- Database query caching

## Support

For issues or questions:
- Check logs first: `pm2 logs cms-backend`
- Review this documentation
- Check GitHub issues: https://github.com/blur702/dalthaus/issues
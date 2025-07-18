# Deployment Guide for Shared Server

## Prerequisites

- Node.js v14+ and npm
- PostgreSQL database
- Git access
- Domain or subdomain configured

## Deployment Steps

### 1. Clone Repository

```bash
git clone <repository-url> /path/to/your/directory
cd /path/to/your/directory
```

### 2. Backend Setup

```bash
cd backend
npm install

# Copy and configure environment
cp .env.example .env
nano .env
```

Update `.env` with:
- `JWT_SECRET` - Keep the secure value or generate new with `openssl rand -base64 32`
- `NODE_ENV=production`
- `PORT=5001` (or your preferred port)

### 3. Database Configuration

Edit `/var/www/config/database.json` with your PostgreSQL credentials:

```json
{
  "production": {
    "username": "your_db_user",
    "password": "your_db_password",
    "database": "your_db_name",
    "host": "localhost",
    "dialect": "postgres"
  }
}
```

### 4. Frontend Build

```bash
cd ../frontend
npm install
npm run build
```

The built files will be in `frontend/dist/`

### 5. Production Server Setup

For production, the backend serves the frontend files:

```bash
cd ../backend
NODE_ENV=production npm start
```

### 6. Process Management (PM2 Recommended)

```bash
npm install -g pm2

# Start the application
pm2 start server.js --name "admin-panel"

# Save PM2 configuration
pm2 save
pm2 startup
```

### 7. Nginx Configuration (if using)

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:5001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### 8. SSL Certificate (Recommended)

```bash
# Using Let's Encrypt
sudo certbot --nginx -d your-domain.com
```

## Important Notes

1. **JWT Secret**: Never change the JWT_SECRET in production unless you want to invalidate all sessions
2. **Database**: Ensure PostgreSQL is running and accessible
3. **Firewall**: Open necessary ports (80, 443 for web, 5432 for PostgreSQL if remote)
4. **Backups**: Set up regular database backups
5. **Logs**: Monitor `pm2 logs admin-panel` for errors

## Default Credentials

- Username: `admin`
- Password: `(130Bpm)`

**Change this password immediately after first login!**

## Troubleshooting

- Check logs: `pm2 logs admin-panel`
- Verify database connection: `psql -U username -d database_name`
- Ensure all dependencies installed: `npm install` in both frontend and backend
- Check Node version: `node --version` (must be v14+)

## Security Checklist

- [ ] Change default admin password
- [ ] Set strong JWT_SECRET
- [ ] Configure firewall rules
- [ ] Enable SSL/HTTPS
- [ ] Set up regular backups
- [ ] Monitor access logs
- [ ] Keep dependencies updated
# JWT Secret Configuration

## Current Setup

The JWT secret has been updated to a secure, randomly generated value.

### Important Information:

1. **Secret Location**: The JWT secret is stored in `/var/www/public_html/backend/.env`
2. **Current Value**: `nRcq+mw6b8XT+LBpAFo80KI+GieyTbL7sy7qDqcP/gs=`
3. **Generated on**: 2025-07-18

### Security Notes:

- ✅ The secret is now secure and randomly generated
- ✅ It's stored in .env which is gitignored
- ✅ All new tokens will be signed with this secret
- ⚠️ All existing tokens are now invalid (users need to log in again)

### What This Means:

1. **Better Security**: Your JWT tokens are now cryptographically secure
2. **Session Persistence**: As long as this secret remains the same, user sessions will persist
3. **No Expiration**: Tokens still have no expiration date as configured

### If You Need to Change the Secret Again:

```bash
# Generate a new secret
openssl rand -base64 32

# Update the .env file
nano /var/www/public_html/backend/.env

# Restart the server
cd /var/www/public_html/backend
npm start
```

### Backup Recommendation:

Store this secret securely in a password manager or secure location. If you lose it and need to restore from backup, you'll need the same secret for existing sessions to work.
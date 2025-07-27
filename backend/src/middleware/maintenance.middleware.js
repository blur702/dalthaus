const { SiteSettings } = require('../models');
const jwt = require('jsonwebtoken');

const checkMaintenanceMode = async (req, res, next) => {
  try {
    // Get the full URL path
    const fullPath = req.originalUrl || req.url;
    
    // List of paths that should never be blocked by maintenance mode
    const allowedPaths = [
      '/api/auth/',
      '/api/settings/maintenance-status',
      '/api/users',
      '/api/admin/',
      '/api/settings/',
      '/api/templates/',
      '/api/tinymce/',
      '/api/upload/'
    ];
    
    // Check if the current path should be allowed
    const isAllowed = allowedPaths.some(path => fullPath.startsWith(path));
    if (isAllowed) {
      return next();
    }
    
    // Get site settings
    const settings = await SiteSettings.findOne();
    
    // If no settings or maintenance mode is off, continue
    if (!settings || !settings.maintenanceMode) {
      return next();
    }

    // Check if the request has an auth token
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      try {
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // Authenticated users (admins) can bypass maintenance mode
        req.user = decoded;
        return next();
      } catch (error) {
        // Invalid token, continue with maintenance check
      }
    }

    // Check if the request IP is in the bypass list
    const clientIp = req.ip || req.connection.remoteAddress;
    const bypassIps = settings.maintenanceBypassIps || [];
    
    if (bypassIps.includes(clientIp)) {
      return next();
    }

    // Check for IPv6 localhost
    if (clientIp === '::1' && bypassIps.includes('127.0.0.1')) {
      return next();
    }

    // Return maintenance mode response
    return res.status(503).json({
      error: 'Site under maintenance',
      message: settings.maintenanceMessage || 'The site is currently under maintenance. Please check back later.',
      maintenanceMode: true
    });

  } catch (error) {
    // Removed console statement
    // In case of error, allow the request to continue
    return next();
  }
};

module.exports = { checkMaintenanceMode };
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'a-default-secret-key-for-dev';

const protect = (req, res, next) => {
  let token;
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    try {
      // Get token from header
      token = authHeader.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, JWT_SECRET);

      // Attach user to the request object (excluding password)
      req.user = decoded;
      next();
    } catch (error) {
      console.error(error);
      return res.status(401).json({ error: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    return res.status(401).json({ error: 'Not authorized, no token' });
  }
};

const isAdmin = (req, res, next) => {
    if (req.user && (req.user.role === 'admin' || req.user.role === 'superuser')) {
        next();
    } else {
        res.status(403).json({ error: 'Not authorized as an admin' });
    }
};

module.exports = { protect, isAdmin };
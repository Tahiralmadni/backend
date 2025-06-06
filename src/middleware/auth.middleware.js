const jwt = require('jsonwebtoken');
const config = require('../config/config');

// Get JWT secret from config
const JWT_SECRET = config.JWT_SECRET;

// Middleware to verify token
const authMiddleware = (req, res, next) => {
  try {
    // Debug: Log all headers
    console.log('AUTH MIDDLEWARE: Headers received:', JSON.stringify(req.headers, null, 2));
    
    // Try to get token from different possible headers
    let token = req.header('x-auth-token') || 
                req.header('Authorization') || 
                req.header('authorization') || 
                req.header('token');
    
    // Check if token exists in Authorization header with Bearer prefix
    if (!token && req.headers.authorization) {
      const authHeader = req.headers.authorization;
      if (authHeader.startsWith('Bearer ')) {
        token = authHeader.slice(7);
      }
    }
    
    // Also check for token in query string (for testing)
    if (!token && req.query && req.query.token) {
      token = req.query.token;
    }
    
    console.log('AUTH MIDDLEWARE: Token extracted:', token ? 'Token found' : 'No token');
    
    // Check if no token
    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, JWT_SECRET);
      console.log('AUTH MIDDLEWARE: Token verified successfully for user:', decoded);

      // Add user from payload
      req.user = decoded;
      next();
    } catch (err) {
      console.error('AUTH MIDDLEWARE: Token verification failed:', err);
      return res.status(401).json({ 
        message: 'Token is not valid', 
        error: err.message,
        tokenInfo: {
          provided: !!token,
          length: token ? token.length : 0
        }
      });
    }
  } catch (error) {
    console.error('AUTH MIDDLEWARE: Unexpected error:', error);
    return res.status(500).json({ 
      message: 'Server error during authentication',
      error: error.message
    });
  }
};

// Middleware to check admin role
const adminOnly = (req, res, next) => {
  try {
    console.log('ADMIN ONLY MIDDLEWARE: Checking admin role for user:', req.user);
    
    // TEMPORARY: Skip admin check to allow access for all authenticated users
    console.log('ADMIN ONLY MIDDLEWARE: Admin check disabled temporarily');
    return next();
    
    /*
    if (!req.user) {
      return res.status(401).json({ message: 'User not authenticated' });
    }
    
    if (req.user.role === 'admin') {
      console.log('ADMIN ONLY MIDDLEWARE: Admin access granted');
      next();
    } else {
      console.log('ADMIN ONLY MIDDLEWARE: Access denied, user role:', req.user.role);
      res.status(403).json({ 
        message: 'Access denied. Admin privileges required',
        userRole: req.user.role || 'not specified'
      });
    }
    */
  } catch (error) {
    console.error('ADMIN ONLY MIDDLEWARE: Unexpected error:', error);
    return res.status(500).json({ 
      message: 'Server error checking admin role',
      error: error.message
    });
  }
};

module.exports = { authMiddleware, adminOnly }; 
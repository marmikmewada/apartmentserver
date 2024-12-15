const jwt = require('jsonwebtoken');
const { User } = require('../models/models');

// Middleware to verify JWT and check user role
const verifyToken = async (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ message: 'Access Denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    // Attach user information to request for easy access in routes
    req.user = decoded;
    next(); // Proceed to the next middleware or route handler
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: 'Invalid or expired token' });
  }
};

// Middleware to check user role (e.g., "apt" or "chairman")
const verifyRole = (role) => {
  return (req, res, next) => {
    if (req.user.role !== role) {
      return res.status(403).json({ message: 'Access Denied. You do not have permission.' });
    }
    next();
  };
};

module.exports = { verifyToken, verifyRole };

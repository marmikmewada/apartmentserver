const jwt = require('jsonwebtoken');
const { Guard } = require('../models/models'); // Import Guard model

// Middleware to verify JWT and track the guard
const verifyGuardToken = async (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', ''); // Get the token from the Authorization header

  if (!token) {
    return res.status(401).json({ message: 'Access Denied. No token provided.' });
  }

  try {
    // Verify the JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    // Attach the guard's details to the request object
    const guard = await Guard.findById(decoded.guardId); // Find the guard based on the decoded guardId
    if (!guard) {
      return res.status(401).json({ message: 'Guard not found' });
    }

    req.guard = guard; // Attach guard information to request for easy access in routes
    next(); // Proceed to the next middleware or route handler
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: 'Invalid or expired token' });
  }
};

module.exports = { verifyGuardToken };

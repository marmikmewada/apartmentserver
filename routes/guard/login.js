const express = require('express');
const jwt = require('jsonwebtoken');
const { Guard } = require('../../models/models'); // Importing Guard model

const router = express.Router();

// Login Route for Guard (POST /login)
router.post('/', async (req, res) => {
  const { password } = req.body; // Get only the password from the body

  if (!password) {
    return res.status(400).json({ message: 'Password is required' });
  }

  try {
    // Find the guard by password (since no email or name is used for login)
    const guard = await Guard.findOne({ password });
    if (!guard) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Create and sign a JWT token (28 days expiration)
    const token = jwt.sign(
      { guardId: guard._id }, // Include the guard's id in the token
      process.env.JWT_SECRET_KEY, // Secret key for signing the token
      { expiresIn: '28d' } // Token expires in 28 days
    );

    // Send the token back to the client
    res.status(200).json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error logging in' });
  }
});

module.exports = router;

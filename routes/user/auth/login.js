const express = require('express');
const jwt = require('jsonwebtoken');
const { User } = require('../../../models/models'); // Importing User model

const router = express.Router();

// Login Route (POST /login)
router.post('/', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Compare passwords (no hashing comparison since you're storing plain text)
    if (user.password !== password) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Create and sign a JWT token (if login successful)
    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role }, // Include user details
      process.env.JWT_SECRET_KEY, // Secret key for signing the token
      { expiresIn: '28d' } // Token expires in 1 hour
    );

    // Send the token back to the client
    res.status(200).json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error logging in' });
  }
});

module.exports = router;

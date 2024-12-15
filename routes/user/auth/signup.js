const express = require('express');
const { User } = require('../../../models/models'); // Importing User model

const router = express.Router();

// Signup Route (POST /signup)
router.post('/', async (req, res) => {
  const { name, email, password, phone } = req.body; // Remove role from the destructuring

  // Basic validation
  if (!name || !email || !password || !phone) { // Remove role check
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create new user without the 'role' field
    const newUser = new User({
      name,
      email,
      password, // Plain text (no password hashing, but should be done in production)
      phone,
    });

    // Save user to the database
    await newUser.save();
    res.status(201).json({ message: 'User created successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error creating user' });
  }
});

module.exports = router;

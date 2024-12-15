const express = require('express');
const { User } = require('../../models/models'); // Importing User model

const router = express.Router();

// Create User Route (POST /createuser)
router.post('/', async (req, res) => {
  const { name, email, password, phone } = req.body; // Destructure incoming data

  // Basic validation
  if (!name || !email || !password || !phone) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    // Get the userId of the requesting chairman from the token (assuming middleware sets req.user)
    const { userId } = req.user; // Assuming req.user is populated with the authenticated user's data

    // Find the requesting chairman user
    const requestingUser = await User.findById(userId);

    if (!requestingUser) {
      return res.status(404).json({ message: 'Requesting user not found' });
    }

    // Allow the chairman to create a user with their own email
    if (requestingUser.role === 'chairman' && requestingUser.email === email) {
      // Proceed to create the user with the same email as the chairman
    } else {
      // Check if the user already exists with the provided email
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
      }
    }

    // Create a new user (no role field here)
    const newUser = new User({
      name,
      email,
      password, // In real applications, hash the password before saving
      phone,
    });

    // Save the user to the database
    await newUser.save();
    res.status(201).json({ message: 'User created successfully' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error creating user' });
  }
});

module.exports = router;

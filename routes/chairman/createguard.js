const express = require('express');
const { Guard } = require('../../models/models'); // Importing Guard model

const router = express.Router();

// Create Guard Route (POST /createguard)
router.post('/', async (req, res) => {
  const { name, password } = req.body; // Destructure incoming data

  // Basic validation
  if (!name || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    // Check if the guard already exists
    const existingGuard = await Guard.findOne({ name });
    if (existingGuard) {
      return res.status(400).json({ message: 'Guard already exists' });
    }

    // Create a new guard
    const newGuard = new Guard({
      name,
      password, // In real applications, hash the password before saving
    });

    // Save the guard to the database
    await newGuard.save();
    res.status(201).json({ message: 'Guard created successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error creating guard' });
  }
});

module.exports = router;

const express = require('express');
const { Apartment, User } = require('../../models/models'); // Importing Apartment and User models

const router = express.Router();

// Create Apartment Route (POST /createapartment)
router.post('/', async (req, res) => {
  const { name, owner } = req.body; // Destructure incoming data

  // Basic validation
  if (!name || !owner) {
    return res.status(400).json({ message: 'Apartment name and owner ID are required' });
  }

  try {
    // Check if the user (owner) exists
    const existingUser = await User.findById(owner);
    if (!existingUser) {
      return res.status(400).json({ message: 'Owner not found' });
    }

    // Check if the apartment already exists
    const existingApartment = await Apartment.findOne({ name });
    if (existingApartment) {
      return res.status(400).json({ message: 'Apartment already exists' });
    }

    // Create a new apartment
    const newApartment = new Apartment({
      name,
      owner, // The owner is set to the User ID passed in the request
    });

    // Save the apartment to the database
    await newApartment.save();
    res.status(201).json({ message: 'Apartment created successfully', apartment: newApartment });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error creating apartment' });
  }
});

module.exports = router;

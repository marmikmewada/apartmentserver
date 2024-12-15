const express = require('express');
const moment = require('moment-timezone');
const { Visitor, Guard, Apartment } = require('../../models/models'); // Import models

const router = express.Router();

// Route to create a visitor entry (POST /entry)
router.post('/', async (req, res) => {
  const { name, phone, purpose, apartmentId, image, vehicleImage } = req.body; // Include image and vehicleImage

  // Ensure all required fields are provided
  if (!name || !phone || !apartmentId) {
    return res.status(400).json({ message: 'Name, phone, and apartmentId are required' });
  }

  try {
    // Check if the guard is authenticated (we assume req.user is the guard)
    const guard = req.user; // The authenticated guard
    if (!guard) {
      return res.status(401).json({ message: 'Guard not authenticated' });
    }

    // Find the apartment by its ID (ensure it exists)
    const apartment = await Apartment.findById(apartmentId);
    if (!apartment) {
      return res.status(404).json({ message: 'Apartment not found' });
    }

    // Get the current time in Indian Standard Time (IST)
    const inTime = moment.tz("Asia/Kolkata").toDate(); // Convert to IST

    // Create the visitor entry
    const visitor = new Visitor({
      name,
      phone,
      purpose,
      image,          // Optional image URL
      vehicleImage,   // Optional vehicle image URL
      inTime,
      apartment: apartment._id, // Reference to the apartment
      inBy: guard._id,          // Reference to the guard who checked in the visitor
    });

    // Save the visitor to the database
    await visitor.save();

    // Respond with the created visitor data
    res.status(201).json({ visitor });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error creating visitor entry' });
  }
});

module.exports = router;

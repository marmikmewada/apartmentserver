const express = require('express');
const { Guard } = require('../../models/models'); // Importing Guard model

const router = express.Router();

// Get All Guards Route (GET /getallguards)
router.get('/', async (req, res) => {
  try {
    // Fetch all guards from the database
    const guards = await Guard.find();

    // Check if guards exist
    if (guards.length === 0) {
      return res.status(404).json({ message: 'No guards found' });
    }

    // Return the guards data
    res.status(200).json({ guards });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error retrieving guards' });
  }
});

module.exports = router;

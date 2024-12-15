const express = require('express');
const { Apartment } = require('../../models/models'); // Importing Apartment model

const router = express.Router();

// Get All Apartments Route (GET /getallapartments)
router.get('/', async (req, res) => {
  try {
    // Fetch all apartments with owner details populated
    const apartments = await Apartment.find()
      .populate('owner', 'name email _id') // Populating the owner details: name, email, and id
      .exec();

    // Check if apartments exist
    if (apartments.length === 0) {
      return res.status(404).json({ message: 'No apartments found' });
    }

    // Return the apartments with the owner details
    res.status(200).json({ apartments });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error retrieving apartments' });
  }
});

module.exports = router;

const express = require('express');
const { Apartment } = require('../../models/models'); // Importing Apartment model

const router = express.Router();

// Delete Apartment Route (DELETE /deleteapartment)
router.delete('/:id', async (req, res) => {
  const { id } = req.params; // Get apartment ID from request parameters

  // Basic validation
  if (!id) {
    return res.status(400).json({ message: 'Apartment ID is required' });
  }

  try {
    // Check if the apartment exists
    const apartment = await Apartment.findById(id);
    if (!apartment) {
      return res.status(404).json({ message: 'Apartment not found' });
    }

    // Delete the apartment
    await Apartment.findByIdAndDelete(id);
    res.status(200).json({ message: 'Apartment deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error deleting apartment' });
  }
});

module.exports = router;

const express = require('express');
const { Guard } = require('../../models/models'); // Importing Guard model

const router = express.Router();

// Delete Guard Route (DELETE /deleteguard/:id)
router.delete('/:id', async (req, res) => {
  const { id } = req.params; // Get guard ID from request parameters

  // Basic validation
  if (!id) {
    return res.status(400).json({ message: 'Guard ID is required' });
  }

  try {
    // Check if the guard exists
    const guard = await Guard.findById(id);
    if (!guard) {
      return res.status(404).json({ message: 'Guard not found' });
    }

    // Delete the guard
    await Guard.findByIdAndDelete(id);
    res.status(200).json({ message: 'Guard deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error deleting guard' });
  }
});

module.exports = router;

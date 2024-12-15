const express = require('express');
const { User } = require('../../models/models'); // Importing User model

const router = express.Router();

// Delete User Route (DELETE /deleteuser/:id)
router.delete('/:id', async (req, res) => {
  const { id } = req.params; // Extract user ID from request parameters

  // Basic validation
  if (!id) {
    return res.status(400).json({ message: 'User ID is required' });
  }

  try {
    // Check if the user exists
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Delete the user
    await User.findByIdAndDelete(id);
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error deleting user' });
  }
});

module.exports = router;

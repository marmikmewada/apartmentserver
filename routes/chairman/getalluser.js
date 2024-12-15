const express = require('express');
const { User, Apartment } = require('../../models/models'); // Import necessary models

const router = express.Router();

// Get Owner Profile Route (GET /owner/getprofile)
router.get('/', async (req, res) => {
  const { userId } = req.user; // Get userId from the decoded token

  try {
    // Fetch the user details based on userId, excluding sensitive fields (password, imageKitPublicKey, gmailPw)
    const user = await User.findById(userId).select('-password -imageKitPublicKey -gmailPw');

    if (!user) {
      return res.status(404).json({ message: 'Owner not found' });
    }

    // Find all apartments owned by the given user (userId)
    const apartments = await Apartment.find({ owner: userId });

    // Include apartments in the response
    const ownerProfile = {
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      apartments: apartments, // Array of apartments owned by the user
    };

    // Send the owner profile response
    res.status(200).json(ownerProfile);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching profile' });
  }
});

module.exports = router;

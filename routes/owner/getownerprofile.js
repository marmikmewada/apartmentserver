const express = require('express');
const { User, Apartment } = require('../../models/models'); // Importing necessary models

const router = express.Router();

// Get Owner Profile Route (GET /owner/getprofile)
router.get('/', async (req, res) => {
  const { userId } = req.user; // Get userId from the decoded token

  try {
    // Find the user details based on the userId
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'Owner not found' });
    }

    // Find all apartments owned by the given user (ownerId)
    const apartments = await Apartment.find({ owner: userId });

    // Include apartments in the response
    const ownerProfile = {
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      imageKitPublicKey: user.imageKitPublicKey,
      gmailPw: user.gmailPw,
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

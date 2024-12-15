const express = require('express');
const { User, Apartment } = require('../../models/models'); // Import necessary models

const router = express.Router();

// Update Owner Profile Route (PUT /owner/updateprofile)
router.put('/', async (req, res) => {
  const { userId } = req.user; // Get userId from the decoded token

  // Destructure the fields we want to allow for updating (excluding role)
  const { name, email, phone, imageKitPublicKey, gmailPw } = req.body;

  // Validate at least one field is provided for update
  if (!name && !email && !phone && !imageKitPublicKey && !gmailPw) {
    return res.status(400).json({ message: 'At least one field (name, email, phone, imageKitPublicKey, gmailPw) is required to update.' });
  }

  try {
    // Find the user based on the userId
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'Owner not found' });
    }

    // Update the user profile with the provided data (excluding role)
    if (name) user.name = name;
    if (email) user.email = email;
    if (phone) user.phone = phone;
    if (imageKitPublicKey) user.imageKitPublicKey = imageKitPublicKey;
    if (gmailPw) user.gmailPw = gmailPw;

    // Save the updated user details
    await user.save();

    // Exclude sensitive fields before sending the response
    const updatedUser = await User.findById(userId).select('-password'); // Exclude password only

    // Find all apartments owned by the given user (ownerId)
    const apartments = await Apartment.find({ owner: userId });

    // Include apartments in the response
    const ownerProfile = {
      id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      phone: updatedUser.phone,
      imageKitPublicKey: updatedUser.imageKitPublicKey,
      gmailPw: updatedUser.gmailPw,
      apartments: apartments, // Array of apartments owned by the user
    };

    // Send the updated profile response
    res.status(200).json(ownerProfile);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error updating profile' });
  }
});

module.exports = router;

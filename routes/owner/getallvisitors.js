const express = require('express');
const { Visitor, Apartment, Guard } = require('../../models/models'); // Importing necessary models

const router = express.Router();

// Get All Visitors Route (POST /getallvisitors)
router.post('/', async (req, res) => {
  const { date } = req.body; // Destructure incoming data
  const { userId } = req.user; // Get userId from the decoded token

  // Basic validation
  if (!date) {
    return res.status(400).json({ message: 'Date is required' });
  }

  try {
    // Find all apartments owned by the given owner ID (userId from token)
    const apartments = await Apartment.find({ owner: userId }).populate('owner', 'name email'); // Populate owner details (name and email)

    if (apartments.length === 0) {
      return res.status(404).json({ message: 'No apartments found for this owner' });
    }

    // Convert the input date string to a Date object (assuming 'date' is in 'YYYY-MM-DD' format)
    const targetDate = new Date(date);
    targetDate.setHours(0, 0, 0, 0); // Set the time to midnight for accurate comparison

    // Find all visitors for those apartments on the given date
    const visitors = await Visitor.find({
      apartment: { $in: apartments.map(apt => apt._id) },
      inTime: { $gte: targetDate }, // Visitors who entered on or after the provided date
      outTime: { $lte: new Date(targetDate).setHours(23, 59, 59, 999) }, // Visitors who left before the end of the day
    })
      .populate('apartment', 'name')  // Populate apartment name
      .populate('inBy', 'name')      // Populate inBy guard name
      .populate('outBy', 'name')     // Populate outBy guard name
      .exec();

    // Return the list of visitors
    res.status(200).json({ visitors });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching visitors' });
  }
});

module.exports = router;

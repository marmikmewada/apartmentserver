const express = require('express');
const moment = require('moment-timezone');
const { Visitor, Guard } = require('../../models/models'); // Import models

const router = express.Router();

// Route to set the outTime for a visitor (POST /outtime)
router.post('/', async (req, res) => {
  const { visitorId } = req.body; // Visitor ID from request body

  // Ensure that visitorId is provided
  if (!visitorId) {
    return res.status(400).json({ message: 'Visitor ID is required' });
  }

  try {
    // Check if the guard is authenticated (we assume req.user is the guard)
    const guard = req.user; // The authenticated guard
    if (!guard) {
      return res.status(401).json({ message: 'Guard not authenticated' });
    }

    // Find the visitor by their ID
    const visitor = await Visitor.findById(visitorId);
    if (!visitor) {
      return res.status(404).json({ message: 'Visitor not found' });
    }

    // Check if the visitor already has an inTime (to ensure the entry has been done)
    if (!visitor.inTime) {
      return res.status(400).json({ message: 'Visitor has not been checked in yet' });
    }

    // Get the current time in Indian Standard Time (IST)
    const outTime = moment.tz("Asia/Kolkata").toDate(); // Convert to IST

    // Set the outTime and outBy (the current guard)
    visitor.outTime = outTime;
    visitor.outBy = guard._id; // Record the guard who is setting the outTime

    // Save the updated visitor document
    await visitor.save();

    // Respond with the updated visitor data
    res.status(200).json({ message: 'Visitor outTime set successfully', visitor });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error setting outTime for visitor' });
  }
});

module.exports = router;

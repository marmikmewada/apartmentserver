const express = require('express');
const { Visitor } = require('../../models/models'); // Importing Visitor model
const moment = require('moment'); // For handling date manipulation

const router = express.Router();

// Route to get all visitors and active visitors for a specific date (POST /)
router.post('/', async (req, res) => {
  const { date } = req.body; // Date passed in request body

  if (!date) {
    return res.status(400).json({ message: 'Date is required' });
  }

  try {
    // Convert the provided date to a start and end date for comparison (using moment)
    const startDate = moment(date).startOf('day').toDate();  // Start of the provided date (00:00:00)
    const endDate = moment(date).endOf('day').toDate();      // End of the provided date (23:59:59)

    // Find all visitors who have an inTime on the given date
    const visitors = await Visitor.find({
      inTime: { $gte: startDate, $lte: endDate }, // Check if inTime is within the provided date range
    })
      .populate('apartment', 'name')  // Optionally populate apartment name
      .populate('inBy', 'name')      // Optionally populate guard who checked in the visitor
      .exec();

    // Filter the visitors to find those who have inTime but no outTime (active visitors)
    const activeVisitors = visitors.filter(visitor => !visitor.outTime);

    // Return the active visitors
    res.status(200).json({ activeVisitors });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching visitors' });
  }
});

module.exports = router;

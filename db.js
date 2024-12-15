// db.js 


const mongoose = require("mongoose");
const dotenv = require('dotenv');

dotenv.config();
console.log(process.env.MONGO_URI)
const MONGO_URI = process.env.MONGO_URI; // Ensure this is set in your environment
// Connect to database
const connectToDatabase = async () => {
  console.log("Connecting to database with URI:", MONGO_URI); // Log the URI

  if (mongoose.connection.readyState === 0) {
    try {
      await mongoose.connect(MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      console.log("Database connected successfully");
    } catch (error) {
      console.error("Database connection error:", error);
      throw new Error("Could not connect to the database");
    }
  } else {
    console.log("Database already connected");
  }
};

module.exports = connectToDatabase;

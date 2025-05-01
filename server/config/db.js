const mongoose = require("mongoose");

const dbURL = process.env.DB_URL; // Ensure DB_URL is defined in your .env file

const connectDB = async () => {
  try {
    await mongoose.connect(dbURL);
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error("Error connecting to MongoDB:", err.message);
   // process.exit(1); // Exit the application on error
  }
};

module.exports = connectDB;

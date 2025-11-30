// Import the mongoose library, which allows us to interact with MongoDB databases
const mongoose = require('mongoose');

// Define an asynchronous function named connectDB
// "async" allows us to use "await" inside this function
const connectDB = async () => {
  try {
    // Try to connect to the MongoDB database using the connection string stored in MONGO_URI
    // process.env.MONGO_URI reads the value from your environment variables
    // mongoose.connect() returns a promise, so we use "await"
    await mongoose.connect(process.env.MONGO_URI); // no options needed

    // If connection is successful, log this message
    console.log('✅ MongoDB Connected Successfully');
  } catch (error) {
    // If there is ANY error connecting, log the error message
    console.error('❌ MongoDB Connection Error:', error.message);

    // Exit the Node.js process with code 1 (means failure)
    // This stops the app from running without a database connection
    process.exit(1);
  }
};

// Export the connectDB function so it can be used in other files (e.g. server.js)
module.exports = connectDB;

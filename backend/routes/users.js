const express = require('express');  
// Import the Express framework

const router = express.Router();  
// Create a router to define API routes

const User = require('../models/User');  
// Import the User model (MongoDB schema)

const bcrypt = require("bcryptjs");  
// Library for hashing passwords


/* -----------------------------
   GET all users
----------------------------- */
router.get('/', async (req, res) => {
  try {
    const users = await User.find().select("-password");
    // Fetch all users, but remove the password field from result

    res.json(users);
    // Send users back as JSON
  } catch (error) {
    res.status(500).json({ message: "Failed to load users" });
    // If something goes wrong → error 500
  }
});


/* -----------------------------
   GET user by ID
----------------------------- */
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    // Find user by ID from URL, remove password field

    if (!user)
      return res.status(404).json({ message: "User not found" });
    // If user does not exist → return 404

    res.json(user);
    // Return found user JSON
  } catch (error) {
    res.status(500).json({ message: "Load failed" });
    // Server error
  }
});


/* -----------------------------
   UPDATE user
----------------------------- */
router.put('/:id', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    // Extract fields sent from frontend

    const user = await User.findById(req.params.id);
    // Find existing user by ID

    if (!user)
      return res.status(404).json({ message: "User not found" });
    // Handle case when user does not exist

    if (username) user.username = username;
    // If username provided → update it

    if (email) user.email = email;
    // If email provided → update it

    if (password && password.trim() !== "") {
      // If new password provided and not empty

      const salt = await bcrypt.genSalt(10);
      // Generate salt for hashing

      user.password = await bcrypt.hash(password, salt);
      // Hash new password and store it
    }

    await user.save();
    // Save updated user to database

    res.json({
      message: "User updated successfully",
      user
    });
    // Send confirmation + updated user data back
  } catch (error) {
    res.status(500).json({ message: "Update failed" });
    // Error handling
  }
});


/* -----------------------------
   DELETE user
----------------------------- */
router.delete('/:id', async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    // Delete user by ID

    if (!deletedUser)
      return res.status(404).json({ message: "User not found" });
    // If nothing was deleted → 404

    res.json({ message: "User deleted successfully" });
    // Successful delete
  } catch (error) {
    res.status(500).json({ message: "Delete failed" });
    // Server error
  }
});


module.exports = router;
// Export router so server.js can use it

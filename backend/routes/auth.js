// Import express to create router
const express = require("express");
const router = express.Router();

// Import User model to interact with MongoDB users collection
const User = require("../models/User");

// Import bcrypt for password hashing
const bcrypt = require("bcryptjs");

// Import jsonwebtoken for creating JWT authentication tokens
const jwt = require("jsonwebtoken");


/*
 |---------------------------------------------------------
 | REGISTER user
 | POST /api/auth/register
 |---------------------------------------------------------
*/
router.post("/register", async (req, res) => {
  try {
    // Extract needed fields from the request body
    const { username, email, password } = req.body;

    // Check whether a user with this email already exists
    const exist = await User.findOne({ email });
    if (exist) return res.status(400).json({ message: "Email already exists" });

    // Generate a bcrypt salt (random data used when hashing)
    const salt = await bcrypt.genSalt(10);

    // Hash the password using the salt
    const hashed = await bcrypt.hash(password, salt);

    // Create a new user document
    const newUser = new User({
      username,
      email,
      password: hashed,
      role: "user", // default role assigned during registration
    });

    // Save new user into MongoDB
    await newUser.save();

    // Send success response back to frontend
    res.json({ message: "User registered", user: newUser });
  } catch (err) {
    // Catch any errors
    res.status(500).json({ message: "Register failed", error: err.message });
  }
});


/*
 |---------------------------------------------------------
 | LOGIN user
 | POST /api/auth/login
 |---------------------------------------------------------
*/
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Look up the user by email
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid email" });

    // Check if the entered password matches the hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid password" });

    // Create a JWT token for authentication
    const token = jwt.sign(
      { id: user._id, role: user.role },   // payload stored inside token
      process.env.JWT_SECRET,             // secret key to sign token
      { expiresIn: "1d" }                 // token expires in 1 day
    );

    // Return user info + token to frontend
    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    res.status(500).json({ message: "Login failed", error: err.message });
  }
});


/*
 |---------------------------------------------------------
 | GET all users (admin)
 | GET /api/auth/
 |---------------------------------------------------------
*/
router.get("/", async (req, res) => {
  try {
    // Fetch all users except passwords
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});


/*
 |---------------------------------------------------------
 | GET single user by ID
 | GET /api/auth/:id
 |---------------------------------------------------------
*/
router.get("/:id", async (req, res) => {
  try {
    // Find user by ID and hide password
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});


/*
 |---------------------------------------------------------
 | UPDATE user
 | PUT /api/auth/:id
 |---------------------------------------------------------
*/
router.put("/:id", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Find user
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Update username if provided
    if (username) user.username = username;

    // Update email if provided
    if (email) user.email = email;

    // If password exists and not empty
    if (password && password.trim() !== "") {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }

    // Save user with updated fields
    await user.save();

    res.json({ message: "User updated", user });
  } catch (err) {
    res.status(500).json({ message: "Update failed", error: err.message });
  }
});


/*
 |---------------------------------------------------------
 | DELETE user
 | DELETE /api/auth/:id
 |---------------------------------------------------------
*/
router.delete("/:id", async (req, res) => {
  try {
    // Delete user by ID
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ message: "User deleted" });
  } catch (err) {
    res.status(500).json({ message: "Delete failed", error: err.message });
  }
});

// Export router so it can be used in server.js
module.exports = router;

const express = require('express');
// Import Express framework

const cors = require('cors');
// Allows frontend (React) to communicate with backend

const dotenv = require('dotenv');
// Loads .env variables (like MONGO_URI, JWT_SECRET)

const connectDB = require('./config/db');
// Function that connects to MongoDB database


// routes
const userRoutes = require('./routes/users');
// User CRUD routes (get, update, delete users)

const authRoutes = require('./routes/auth');
// Login + Register routes

const blogRoutes = require('./routes/blogs');
// Blog CRUD routes (create, edit, delete blog posts)


dotenv.config();
// Load environment variables from .env file

const app = express();
// Initialize Express server


// -------------------------
// CONNECT TO DATABASE
// -------------------------
connectDB();
// Runs MongoDB connection as soon as server starts


// -------------------------
// MIDDLEWARE
// -------------------------
app.use(cors());
// Allows requests from your frontend (e.g. localhost:5173)

app.use(express.json());
// Parses JSON request bodies (e.g. { "email": "test@example.com" })

app.use(express.urlencoded({ extended: true }));
// Allows form-data / URL encoded requests


// -------------------------
// ROUTES
// -------------------------
app.use('/api/auth', authRoutes);
// Auth: login, register

app.use('/api/blogs', blogRoutes);
// Blog CRUD routes

app.use('/api/users', userRoutes);
// User CRUD routes (GET/PUT/DELETE)
// IMPORTANT → only one user route. No duplication.


// -------------------------
// ERROR HANDLER
// -------------------------
app.use((err, req, res, next) => {
  console.error(err.stack);
  // Shows error in console

  res.status(500).json({ message: 'Something went wrong!' });
  // Sends generic server error response
});


// -------------------------
// START SERVER
// -------------------------
const PORT = process.env.PORT || 5000;
// Use port from .env or default to 5000

app.listen(PORT, () =>
  console.log(`🚀 Server running on port ${PORT}`)
);
// Start Express server

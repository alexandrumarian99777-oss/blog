// Import the jsonwebtoken library so we can verify JWT tokens
const jwt = require('jsonwebtoken');

// Import the User model so we can look up the user in the database
const User = require('../models/User');

// Middleware function to protect routes (only logged-in users can access)
const protect = async (req, res, next) => {
  let token; // will store the token if found

  try {
    // Check if the Authorization header exists AND starts with "Bearer"
    // Example of valid header: "Authorization: Bearer <token>"
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      // Extract the token part ("Bearer <token>" → "<token>")
      token = req.headers.authorization.split(' ')[1];

      // Verify the token using your secret key from .env
      // decoded = { id: "...", iat: ..., exp: ... }
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Find the user in the database using the decoded user ID
      // Excluding the password field with .select('-password')
      req.user = await User.findById(decoded.id).select('-password');

      // If no user exists with that ID, return 401 (unauthorized)
      if (!req.user) {
        return res.status(401).json({ success: false, message: 'User not found' });
      }

      // User exists → allow access to the protected route
      next();
    } else {
      // No Authorization header or no Bearer token
      return res.status(401).json({ success: false, message: 'No token provided' });
    }
  } catch (error) {
    // Any error during verification (expired token, wrong signature, etc.)
    return res.status(401).json({
      success: false,
      message: 'Not authorized',
      error: error.message,
    });
  }
};

// Export the protect middleware so you can use it in routes
module.exports = { protect };

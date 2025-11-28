const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Protect middleware
const protect = async (req, res, next) => {
  let token;

  try {
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Attach user to request
      req.user = await User.findById(decoded.id).select('-password');
      if (!req.user) {
        return res.status(401).json({ success: false, message: 'User not found' });
      }

      next();
    } else {
      return res.status(401).json({ success: false, message: 'No token provided' });
    }
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Not authorized', error: error.message });
  }
};

module.exports = { protect };

// Import mongoose so we can create schemas and models
const mongoose = require('mongoose');

// Create a new schema for the Blog model
// This defines the structure of each blog document in MongoDB
const blogSchema = new mongoose.Schema({
  
  // Title of the blog post
  title: {
    type: String,        // Must be a string
    required: true,      // Title is required
    trim: true,          // Removes extra spaces at start/end
  },

  // Full content/body of the blog post
  content: {
    type: String,
    required: true,      // Content cannot be empty
  },

  // The user who wrote the blog post (references the User model)
  author: {
    type: mongoose.Schema.Types.ObjectId, // Stores user ID
    ref: 'User',                          // Links to User collection
    required: true,                       // Every blog needs an author
  },

  // Short preview text of the blog shown on cards/pages
  excerpt: {
    type: String,
    maxlength: 200,      // Limits excerpt to 200 characters
  },

  // Array of tags (e.g., ["coding", "javascript"])
  tags: [{
    type: String,
    trim: true,          // Remove extra spaces for each tag
  }],

  // Image for the blog post; uses a default image if not provided
  imageUrl: {
    type: String,
    default: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800',
  },

  // Whether the blog is published or not (good for drafts)
  published: {
    type: Boolean,
    default: true,
  },

// Adds createdAt and updatedAt fields automatically
}, { timestamps: true });

// Export the model so you can use it in routes/controllers
module.exports = mongoose.model('Blog', blogSchema);

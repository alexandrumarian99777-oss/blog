// Import express so we can create a router
const express = require('express');

// Import Blog model to interact with blog documents in MongoDB
const Blog = require('../models/Blog');

// Import protect middleware (checks JWT token + attaches req.user)
const { protect } = require('../middleware/auth');

// Create express router
const router = express.Router();


/* ======================================================
   GET ALL BLOGS (PUBLIC)
   GET /api/blogs
   Returns all published blogs
====================================================== */
router.get('/', async (req, res) => {
  try {
    // Find blogs where published = true
    const blogs = await Blog.find({ published: true })
      .populate('author', 'username')   // Add only username of author
      .sort({ createdAt: -1 });         // Newest blog first

    res.json(blogs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


/* ======================================================
   GET SINGLE BLOG BY ID (PUBLIC)
   GET /api/blogs/:id
====================================================== */
router.get('/:id', async (req, res) => {
  try {
    // Find blog with given ID
    const blog = await Blog.findById(req.params.id)
      .populate('author', 'username email'); // Include author info

    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    res.json(blog);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


/* ======================================================
   CREATE BLOG (PROTECTED)
   POST /api/blogs
   Only logged-in users can create blogs
====================================================== */
router.post('/', protect, async (req, res) => {
  try {
    const { title, content, excerpt, tags, imageUrl } = req.body;

    // Create new blog entry
    const blog = await Blog.create({
      title,
      content,
      excerpt,
      tags,
      imageUrl,
      author: req.user._id,  // protect middleware puts user in req.user
    });

    // Populate author data so frontend sees username
    const populatedBlog = await Blog.findById(blog._id)
      .populate('author', 'username');

    res.status(201).json(populatedBlog);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


/* ======================================================
   UPDATE BLOG (PROTECTED)
   PUT /api/blogs/:id
   Only the blog owner can edit it
====================================================== */
router.put('/:id', protect, async (req, res) => {
  try {
    // Find blog by ID
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    // Check ownership: only the author can edit
    if (blog.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this blog' });
    }

    // Update blog with the fields from req.body
    const updatedBlog = await Blog.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }  // new=true returns updated doc
    ).populate('author', 'username');     // Re-populate author

    res.json(updatedBlog);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


/* ======================================================
   DELETE BLOG (PROTECTED)
   DELETE /api/blogs/:id
   Only the author can delete it
====================================================== */
router.delete('/:id', protect, async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    // Ownership check
    if (blog.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this blog' });
    }

    // Delete blog
    await Blog.findByIdAndDelete(req.params.id);

    res.json({ message: 'Blog deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Export router so server.js can use it
module.exports = router;

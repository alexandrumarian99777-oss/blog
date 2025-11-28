const express = require('express');
const Blog = require('../models/Blog');
const { protect } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/blogs
// @desc    Get all blogs (public)
router.get('/', async (req, res) => {
  try {
    const blogs = await Blog.find({ published: true })
      .populate('author', 'username')
      .sort({ createdAt: -1 });
    res.json(blogs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/blogs/:id
// @desc    Get single blog
router.get('/:id', async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id).populate('author', 'username email');
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }
    res.json(blog);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/blogs
// @desc    Create blog (protected)
router.post('/', protect, async (req, res) => {
  try {
    const { title, content, excerpt, tags, imageUrl } = req.body;

    const blog = await Blog.create({
      title,
      content,
      excerpt,
      tags,
      imageUrl,
      author: req.user._id,
    });

    const populatedBlog = await Blog.findById(blog._id).populate('author', 'username');
    res.status(201).json(populatedBlog);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   PUT /api/blogs/:id
// @desc    Update blog (protected)
router.put('/:id', protect, async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    // Check ownership
    if (blog.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this blog' });
    }

    const updatedBlog = await Blog.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('author', 'username');

    res.json(updatedBlog);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   DELETE /api/blogs/:id
// @desc    Delete blog (protected)
router.delete('/:id', protect, async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    // Check ownership
    if (blog.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this blog' });
    }

    await Blog.findByIdAndDelete(req.params.id);
    res.json({ message: 'Blog deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
const Resource = require('../models/Resource');

// @desc    Upload a new resource
// @route   POST /api/resources
// @access  Private
exports.createResource = async (req, res) => {
  const { title, description, link, type, tags } = req.body;

  try {
    const resource = await Resource.create({
      title,
      description,
      link,
      type,
      tags,
      uploadedBy: req.user._id // Taken from the JWT token
    });
    res.status(201).json(resource);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all resources
// @route   GET /api/resources
// @access  Public
exports.getAllResources = async (req, res) => {
  try {
    // .populate() replaces the ID with the actual User Name
    const resources = await Resource.find()
      .populate('uploadedBy', 'name email reputation')
      .sort({ createdAt: -1 }); // Newest first

    res.json(resources);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const Resource = require('../models/Resource');
const asyncHandler = require('../utils/asyncHandler');

// @desc    Upload a new resource
// @route   POST /api/resources
// @access  Private
exports.createResource = asyncHandler(async (req, res) => {
  const { title, description, link, type, tags } = req.body;

  const resource = await Resource.create({
    title,
    description,
    link,
    type,
    tags,
    uploadedBy: req.user._id // Taken from the JWT token
  });
  res.status(201).json(resource);
});

// @desc    Get all resources
// @route   GET /api/resources
// @access  Public
exports.getAllResources = asyncHandler(async (req, res) => {
  // .populate() replaces the ID with the actual User Name
  const resources = await Resource.find()
    .populate('uploadedBy', 'name email reputation')
    .sort({ createdAt: -1 }); // Newest first

  res.json(resources);
});
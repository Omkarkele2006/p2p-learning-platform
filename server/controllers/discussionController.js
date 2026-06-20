const Discussion = require('../models/Discussion');
const asyncHandler = require('../utils/asyncHandler');

// @desc    Create a new discussion
// @route   POST /api/discussions
// @access  Private
exports.createDiscussion = asyncHandler(async (req, res) => {
  const { title, content, resourceId } = req.body;
  const discussion = await Discussion.create({
    title,
    content,
    resourceId: resourceId || null, // Optional
    author: req.user._id
  });
  await discussion.populate('author', 'name reputation');
  res.status(201).json(discussion);
});

// @desc    Get all discussions
// @route   GET /api/discussions
// @access  Public
exports.getAllDiscussions = asyncHandler(async (req, res) => {
  const discussions = await Discussion.find()
    .populate('author', 'name reputation') // Show who asked
    .populate('resourceId', 'title')       // Show linked resource name
    .populate('replies.user', 'name')
    .sort({ createdAt: -1 });

  res.json(discussions);
});

// @desc    Reply to a discussion
// @route   POST /api/discussions/:id/reply
// @access  Private
exports.addReply = asyncHandler(async (req, res) => {
  const discussion = await Discussion.findById(req.params.id);

  if (!discussion) {
    return res.status(404).json({ message: 'Discussion not found' });
  }

  const reply = {
    user: req.user._id,
    text: req.body.text
  };

  discussion.replies.push(reply);
  await discussion.save();

  await discussion.populate('replies.user', 'name');

  res.status(201).json(discussion.replies);
});
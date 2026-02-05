const Discussion = require('../models/Discussion');

// @desc    Create a new discussion
// @route   POST /api/discussions
// @access  Private
exports.createDiscussion = async (req, res) => {
  const { title, content, resourceId } = req.body;
  try {
    const discussion = await Discussion.create({
      title,
      content,
      resourceId: resourceId || null, // Optional
      author: req.user._id
    });
    res.status(201).json(discussion);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all discussions
// @route   GET /api/discussions
// @access  Public
exports.getAllDiscussions = async (req, res) => {
  try {
    const discussions = await Discussion.find()
      .populate('author', 'name reputation') // Show who asked
      .populate('resourceId', 'title')       // Show linked resource name
      .sort({ createdAt: -1 });

    res.json(discussions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Reply to a discussion
// @route   POST /api/discussions/:id/reply
// @access  Private
exports.addReply = async (req, res) => {
  try {
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

    res.status(201).json(discussion.replies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
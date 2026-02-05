const User = require('../models/User');

// @desc    Update user profile (Skills/Interests)
// @route   PUT /api/users/profile
// @access  Private
exports.updateUserProfile = async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.skills = req.body.skills || user.skills;
    user.interests = req.body.interests || user.interests;
    
    const updatedUser = await user.save();
    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      skills: updatedUser.skills,
      interests: updatedUser.interests,
    });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};

// @desc    Find peers based on user's interests
// @route   GET /api/users/matches
// @access  Private
exports.getPeerMatches = async (req, res) => {
  try {
    const userInterests = req.user.interests; // Get what the logged-in user wants to learn

    // Find other users who have at least one of these interests in their SKILLS array
    const matches = await User.find({
      skills: { $in: userInterests },
      _id: { $ne: req.user._id } // Don't match the user with themselves!
    }).select('name email skills reputation');

    res.json(matches);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
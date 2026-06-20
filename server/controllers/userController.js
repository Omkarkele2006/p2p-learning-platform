const User = require('../models/User');
const Discussion = require('../models/Discussion');
const Resource = require('../models/Resource');
const asyncHandler = require('../utils/asyncHandler');

// @desc    Update user profile (Skills/Interests/Bio)
// @route   PUT /api/users/profile
// @access  Private
exports.updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.skills = req.body.skills || user.skills;
    user.interests = req.body.interests || user.interests;
    user.bio = typeof req.body.bio !== 'undefined' ? req.body.bio : user.bio;
    
    const updatedUser = await user.save();
    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      skills: updatedUser.skills,
      interests: updatedUser.interests,
      bio: updatedUser.bio,
    });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
});

// @desc    Find peers based on user's interests
// @route   GET /api/users/matches
// @access  Private
exports.getPeerMatches = asyncHandler(async (req, res) => {
  const userInterests = req.user.interests; // Get what the logged-in user wants to learn

  // Find other users who have at least one of these interests in their SKILLS array
  const matches = await User.find({
    skills: { $in: userInterests },
    _id: { $ne: req.user._id } // Don't match the user with themselves!
  }).select('name email skills interests reputation');

  res.json(matches);
});

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
exports.getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      skills: user.skills,
      interests: user.interests,
      reputation: user.reputation,
      bio: user.bio,
    });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
});

// @desc    Get user activity summary
// @route   GET /api/users/activity-summary
// @access  Private
exports.getUserActivitySummary = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  // Count discussions created
  const discussionCount = await Discussion.countDocuments({ author: user._id });

  // Count replies posted
  const discussionsWithReplies = await Discussion.aggregate([
    { $unwind: '$replies' },
    { $match: { 'replies.user': user._id } },
    { $count: 'count' }
  ]);
  const replyCount = discussionsWithReplies.length > 0 ? discussionsWithReplies[0].count : 0;

  // Count resources shared
  const resourceCount = await Resource.countDocuments({ uploadedBy: user._id });

  // Count matches found
  const matchCount = await User.countDocuments({
    skills: { $in: user.interests },
    _id: { $ne: user._id }
  });

  // Calculate profile completion %
  // Name (20%), Skills (20%), Interests (20%), Bio (20%), Contribution (20%)
  let profileCompletion = 0;
  if (user.name) profileCompletion += 20;
  if (user.skills && user.skills.length > 0) profileCompletion += 20;
  if (user.interests && user.interests.length > 0) profileCompletion += 20;
  if (user.bio && user.bio.trim() !== '') profileCompletion += 20;
  if (resourceCount > 0 || discussionCount > 0 || replyCount > 0) profileCompletion += 20;

  // Determine Badge Tier
  let badge = "New Learner";
  const rep = user.reputation || 0;
  if (rep >= 300) badge = "Community Leader";
  else if (rep >= 150) badge = "Mentor";
  else if (rep >= 75) badge = "Contributor";
  else if (rep >= 25) badge = "Active Member";

  res.json({
    reputation: rep,
    discussionCount,
    replyCount,
    resourceCount,
    matchCount,
    profileCompletion,
    badge
  });
});

// @desc    Get user recent activities
// @route   GET /api/users/recent-activity
// @access  Private
exports.getUserRecentActivity = asyncHandler(async (req, res) => {
  // Discussions
  const discussions = await Discussion.find({ author: req.user._id })
    .sort({ createdAt: -1 })
    .limit(5)
    .select('title createdAt');

  const discActivity = discussions.map(d => ({
    type: 'discussion',
    title: d.title,
    description: `Created discussion: "${d.title}"`,
    link: `/forum`,
    createdAt: d.createdAt
  }));

  // Resources
  const resources = await Resource.find({ uploadedBy: req.user._id })
    .sort({ createdAt: -1 })
    .limit(5)
    .select('title createdAt');

  const resActivity = resources.map(r => ({
    type: 'resource',
    title: r.title,
    description: `Shared resource: "${r.title}"`,
    link: `/resources`,
    createdAt: r.createdAt
  }));

  // Replies
  const discussionsWithReplies = await Discussion.find({ 'replies.user': req.user._id })
    .select('title replies');
  
  const replies = [];
  discussionsWithReplies.forEach(disc => {
    disc.replies.forEach(rep => {
      if (rep.user && rep.user.toString() === req.user._id.toString()) {
        replies.push({
          discussionId: disc._id,
          discussionTitle: disc.title,
          text: rep.text,
          createdAt: rep.createdAt
        });
      }
    });
  });

  const replyActivity = replies.map(r => ({
    type: 'reply',
    title: r.discussionTitle,
    description: `Replied to discussion: "${r.discussionTitle}"`,
    link: `/forum`,
    createdAt: r.createdAt
  }));

  // Combine, sort, and slice to top 5
  const allActivities = [...discActivity, ...resActivity, ...replyActivity]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  res.json(allActivities);
});
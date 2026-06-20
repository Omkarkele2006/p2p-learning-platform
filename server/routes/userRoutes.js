const express = require('express');
const router = express.Router();
const { 
  updateUserProfile, 
  getPeerMatches, 
  getUserProfile,
  getUserActivitySummary,
  getUserRecentActivity,
  getPublicStats
} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');
const { validate, updateProfileRules } = require('../middleware/validationMiddleware');

// Public platform metrics
router.route('/public-stats').get(getPublicStats);

// Profile routes
router.route('/profile')
  .get(protect, getUserProfile)
  .put(protect, validate(updateProfileRules), updateUserProfile);

router.route('/matches').get(protect, getPeerMatches);

// Activity summaries & timelines
router.route('/activity-summary').get(protect, getUserActivitySummary);
router.route('/recent-activity').get(protect, getUserRecentActivity);

module.exports = router;
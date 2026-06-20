const express = require('express');
const router = express.Router();
const { updateUserProfile, getPeerMatches, getUserProfile } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');
const { validate, updateProfileRules } = require('../middleware/validationMiddleware');

// Change this line:
router.route('/profile')
  .get(protect, getUserProfile)   // <--- Add this
  .put(protect, validate(updateProfileRules), updateUserProfile);
router.route('/matches').get(protect, getPeerMatches);

module.exports = router;
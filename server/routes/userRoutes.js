const express = require('express');
const router = express.Router();
const { updateUserProfile, getPeerMatches } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

router.route('/profile').put(protect, updateUserProfile);
router.route('/matches').get(protect, getPeerMatches);

module.exports = router;
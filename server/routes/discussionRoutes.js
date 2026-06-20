const express = require('express');
const router = express.Router();
const { createDiscussion, getAllDiscussions, addReply } = require('../controllers/discussionController');
const { protect } = require('../middleware/authMiddleware');
const { validate, createDiscussionRules, createReplyRules } = require('../middleware/validationMiddleware');

router.route('/')
  .post(protect, validate(createDiscussionRules), createDiscussion)  // Start a topic (Protected)
  .get(getAllDiscussions);          // Read topics (Public)

router.route('/:id/reply')
  .post(protect, validate(createReplyRules), addReply);         // Reply to topic :id (Protected)

module.exports = router;
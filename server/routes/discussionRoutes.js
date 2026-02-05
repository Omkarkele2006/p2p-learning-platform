const express = require('express');
const router = express.Router();
const { createDiscussion, getAllDiscussions, addReply } = require('../controllers/discussionController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
  .post(protect, createDiscussion)  // Start a topic (Protected)
  .get(getAllDiscussions);          // Read topics (Public)

router.route('/:id/reply')
  .post(protect, addReply);         // Reply to topic :id (Protected)

module.exports = router;
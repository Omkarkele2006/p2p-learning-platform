const mongoose = require('mongoose');

const discussionSchema = mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  
  // Who asked the question?
  author: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  
  // Optional: Is this question about a specific Resource?
  resourceId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Resource' 
  },

  // The Replies (Threaded comments)
  replies: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    text: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
  }]
}, { timestamps: true });

module.exports = mongoose.model('Discussion', discussionSchema);
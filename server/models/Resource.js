const mongoose = require('mongoose');

const resourceSchema = mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  link: { type: String, required: true }, // URL to Drive/YouTube
  type: { type: String, enum: ['Video', 'Article', 'Note', 'Repo'], required: true },
  tags: [String], // e.g., ["React", "Frontend", "Beginner"]
  uploadedBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', // Links to the User model
    required: true 
  },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] // Who liked it
}, { timestamps: true });

module.exports = mongoose.model('Resource', resourceSchema);
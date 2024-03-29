const mongoose = require('mongoose');

const ForumMessageSchema = new mongoose.Schema({
  title: { type: String, required: true },
  text: { type: String, required: true },
  forumThreadID: { type: String, required: true },
  userID: { type: String, required: true },
  edited: { type: Boolean, default: false },
  likes: { type: Number, default: 0 },
  dislikes: { type: Number, default: 0 }
}, { timestamps: true}
);

const ForumMessage = mongoose.model('ForumMessage', ForumMessageSchema);

module.exports = ForumMessage;
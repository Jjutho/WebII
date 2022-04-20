const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const forumMessages = require('./ForumMessageModel');

const ForumThreadSchema = new mongoose.Schema({
  forumThreadID: { type: String, unique: true, required: true },
  forumThreadName: String,
  forumThreadMessages: forumMessages,
}, { timestamps: true}
);

const ForumThread = mongoose.model('ForumThread', ForumThreadSchema);

module.exports = ForumThread;
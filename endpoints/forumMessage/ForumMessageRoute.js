const express = require('express');
const ForumMessageRouter = express.Router();

const ForumMessageService = require('./ForumMessageService');

const auth = require('../../utils/auth');

// create forumMessage
ForumMessageRouter.post('/', auth.isAuthenticated, (req, res, next) => {
  ForumMessageService.createForumMessage(req.body, req.user.userID, (msg, message, code) => {
    if (message) {
      res.status(code).json(message);
    } else {
      res.status(code).json({
        Error: msg
      });
    }
  });
});

// get all forumMessages or by forumThreadID
ForumMessageRouter.get('/', (req, res, next) => {
  const { forumThreadID } = req.query;
  if (forumThreadID) {
    ForumMessageService.getForumMessagesByForumThreadId(forumThreadID, (msg, messages, code) => {
      if (messages) {
        res.status(code).json(messages);
      } else {
        res.status(code).json({
          Error: msg
        });
      }
    });
  } else {
  ForumMessageService.getForumMessages((msg, messages, code) => {
    if (messages) {
      res.status(code).json(messages);
    } else {
      res.status(code).json({
        Error: msg
      });
    }
  })};
});

// get forumMessages of currentUser
ForumMessageRouter.get('/myForumMessages', auth.isAuthenticated, (req, res, next) => {
  ForumMessageService.getForumMessagesByUserId(req.user.userID, (msg, messages, code) => {
    if (messages) {
      res.status(code).json(messages);
    } else {
      res.status(code).json({
        Error: msg
      });
    }
  });
});

// get forumMessage by ID
ForumMessageRouter.get('/:forumMessageID', (req, res, next) => {
  ForumMessageService.getForumMessageById(req.params.forumMessageID, (msg, message, code) => {
    if (message) {
      res.status(code).json(message);
    } else {
      res.status(code).json({
        Error: msg
      });
    }
  });
});

// update forumMessage by ID
ForumMessageRouter.put('/:forumMessageID', auth.isAuthenticated, (req, res, next) => {
  ForumMessageService.updateForumMessageById(req.params.forumMessageID, req.body, req.user.userID, req.user.isAdministrator, (msg, message, code) => {
    if (message) {
      res.status(code).json(message);
    } else {
      res.status(code).json({
        Error: msg
      });
    }
  });
});

// delete forumMessage by ID
ForumMessageRouter.delete('/:forumMessageID', auth.isAuthenticated, (req, res, next) => {
  ForumMessageService.deleteForumMessageById(req.params.forumMessageID, req.user.userID, req.user.isAdministrator, (msg, result, code) => {
    if (result) {
      res.status(code).json({
        Success: msg
      });
    } else {
      res.status(code).json({
        Error: msg
      });
    }
  });
});

module.exports = ForumMessageRouter;
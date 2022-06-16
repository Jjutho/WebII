const ForumMessage = require('./ForumMessageModel');
const ForumThreadService = require('../forumThread/ForumThreadService');

// create forumMessage
const createForumMessage = (forumMessage, userID, callback) => {
  const { title, text, forumThreadID } = forumMessage;
  if ( !title || !text || !forumThreadID ) {
    callback('Please provide all required fields', null, 400);
  } else {
    ForumThreadService.getForumThreadById( forumThreadID, ( msg, thread, code ) => {
      if (thread) {
        ForumMessage.create({
          title: title,
          text: text,
          forumThreadID: forumThreadID,
          userID: userID
        }, (err, message) => {
          if (err) {
            callback(`Creation of message failed`, null, 500);
            } else {
              const { _id, title, text, forumThreadID, userID, edited, likes, dislikes } = message;
              const subset = { _id, title, text, forumThreadID, userID, edited, likes, dislikes };
              callback(null, subset, 200);
            }
          });
      } else {
        callback( msg, null, code );
      }
    });
  }
}

// find forumMessage by forumThreadId
const getForumMessagesByForumThreadId = (forumThreadID, callback) => {
  ForumThreadService.getForumThreadById( forumThreadID, ( msg, thread, code ) => {
    if (thread) {
      ForumMessage.find({forumThreadID: forumThreadID}).exec((err, messages) => {
        if (messages) {
          let filteredMessages = messages.map(message => {
            const { _id, title, text, forumThreadID, userID, edited, likes, dislikes } = message;
            return { _id, title, text, forumThreadID, userID, edited, likes, dislikes };
          });
          callback(null, filteredMessages, 200);
        } else {
          callback(`No ForumMessages in ForumThread with ID ${forumThreadID} found`, null, 404);
        }
      });
    } else {
      callback( msg, null, code );
    }
  });
}

// get all forumMessages
const getForumMessages = (callback) => {
  ForumMessage.find({}).exec((err, messages) => {
    if (err) {
      callback('Error while getting ForumMessages', null, 500);
    } else {
      let filteredMessages = messages.map(message => {
        const { _id, title, text, forumThreadID, userID, edited, likes, dislikes } = message;
        return { _id, title, text, forumThreadID, userID, edited, likes, dislikes };
      });
      callback(null, filteredMessages, 200);
    }
  });
}

const getForumMessageById = (messageID, callback) => {
  ForumMessage.findOne({_id: messageID}).exec((err, message) => {
    if (err) {
      callback('Error while getting ForumMessage', null, 500);
    } else {
      if (message) {
        const { _id, title, text, forumThreadID, userID, edited, likes, dislikes } = message;
        const subset = { _id, title, text, forumThreadID, userID, edited, likes, dislikes };
        callback(null, subset, 200);
      } else {
        callback(`No ForumMessage with ID "${messageID}" found`, null, 404);
      }
    }
  });
}

const getForumMessagesByUserId = (userID, callback) => {
  ForumMessage.find({userID: userID}).exec((err, messages) => {
    if (err) {
      callback('Error while getting ForumMessages of current user', null, 500);
    } else {
      let filteredMessages = messages.map(message => {
        const { _id, title, text, forumThreadID, userID, edited, likes, dislikes } = message;
        return { _id, title, text, forumThreadID, userID, edited, likes, dislikes };
      });
      callback(null, filteredMessages, 200);
    }
  });
}

// update forumMessage
const updateForumMessageById = (messageID, forumMessage, userID, isAdministrator, callback) => {
  ForumMessage.findOne({_id: messageID}).exec((err, message) => {
    if (message) {
      if (message.userID === userID || isAdministrator) {
        if (!(message.text === forumMessage.text)) {
          message.edited = true;
          console.log('true')
        }
        Object.assign(message, forumMessage);
        message.save((err) => {
          if (err) {
            callback('Error while updating ForumMessage', null, 500);
          } else {
            const { _id, title, text, forumThreadID, userID, edited, likes, dislikes } = message;
            const subset = { _id, title, text, forumThreadID, userID, edited, likes, dislikes };
            callback(null, subset, 200);
          }
        });
      } else {
        callback('You are not allowed to edit this ForumMessage', null, 401);
      }
    } else {
      callback(`No ForumMessage with ID "${messageID}" found`, null, 404);
    }
  });
}

// delete forumMessage
const deleteForumMessageById = (messageID, userID, isAdministrator, callback) => {
  ForumMessage.findOne({_id: messageID}).exec((err, message) => {
    if (message) {
      if(message.userID == userID || isAdministrator) {
        ForumMessage.deleteOne({
          _id: messageID,
          userID: userID
        }).exec((err, result) => {
          if (err) {
            callback('Error while deleting ForumMessage', null, 500);
          } else {
            callback(`ForumMessage from user ${userID} succesfully deleted`, true, 204);
          }
        });
      } else {
        callback('You are not allowed to delete this ForumMessage', null, 401);
      }
    } else {
      callback(`No ForumMessage with ID "${messageID}" was found`, null, 404);
    }
  });
}

module.exports = {
  createForumMessage,
  getForumMessagesByForumThreadId,
  getForumMessages,
  getForumMessageById,
  getForumMessagesByUserId,
  updateForumMessageById,
  deleteForumMessageById
}
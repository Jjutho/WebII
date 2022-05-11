const express = require('express');
const UserRouter = express.Router();

const UserService = require('./UserService');

const auth = require('../../utils/auth');

// create user
UserRouter.post('/', auth.isAuthenticated, auth.isAdministrator, (req, res, next) => {
  UserService.createUser(req.body, (msg, user, code) => {
    if (user) {
      res.status(code).json(user);
    } else {
      res.status(code).json({
        Error: msg
      });
    }
  });
});

// get all users
UserRouter.get('/', auth.isAuthenticated, auth.isAdministrator, (req, res, next) => {
  UserService.getUsers((msg, users, code) => {
    if (users) {
      res.status(code).json(users);
    } else {
      res.status(code).json({
        Error: msg
      });
    }
  });
});

// get user by ID
UserRouter.get('/:userID', auth.isAuthenticated, auth.isAdministrator, (req, res, next) => {
  UserService.findUserById(req.params.userID, (msg, user, code) => {
    if (user) {
      res.status(code).json(user);
    } else {
      res.status(code).json({
        Error: msg
      });
    }
  }, true);
});

// delete user by ID
UserRouter.delete('/:userID', auth.isAuthenticated, auth.isAdministrator, (req, res, next) => {
  UserService.deleteUserById(req.params.userID, (msg, result, code) => {
    if(result) {
      res.status(code).json({
        Success: msg
      });
    } else {
      res.status(code).json({
        Error: msg
      })
    }
  })
});

// FOR DEV ONLY delete all users
UserRouter.delete('/', (req, res, next) => {
  UserService.deleteAllUsers((err, result) => {
    if(result) {
      res.status(200).json({
        Success: `All users succesfully deleted`
      });
    } else {
      res.status(500).json({
        Error: `Could not delete all users`
      })
    }
  })
});

// update user
UserRouter.put('/:userID', auth.isAuthenticated, auth.isAdministrator,(req, res, next) => {
  UserService.updateUserById(req.params.userID, req.body, (msg, user, code) => {
    if (user) {
      res.status(code).json(user)
    } else {
      res.status(code).json({
        Error: msg
      });
    }
  });
});

module.exports = UserRouter;
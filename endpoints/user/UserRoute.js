const express = require('express');
const UserRouter = express.Router();

const UserService = require('./UserService');


// create user
UserRouter.post('/', (req, res, next) => {
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
UserRouter.get('/', (req, res, next) => {
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
UserRouter.get('/:userID', (req, res, next) => {
  UserService.findUserById(req.params.userID, (msg, user, code) => {
    if (user) {
      res.status(code).json({
        userID: user.userID,  
        userName: user.userName,
        isAdministrator: user.isAdministrator,
        email: user.email
      });
    } else {
      res.status(code).json({
        Error: msg
      });
    }
  });
});

// delete user by ID
UserRouter.delete('/:userID', (req, res, next) => {
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

// update administrator status
UserRouter.post('/:userID/:isAdministrator', (req, res, next) => {
  UserService.changeAdministratorStatus(req.params.userID, req.params.isAdministrator, (msg, user, code) => {
    if (user) {
      res.status(code).json(user)
    } else {
      res.status(code).json({
        Error: msg
      });
    }
  });
});

// update user
UserRouter.put('/:userID', (req, res, next) => {
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
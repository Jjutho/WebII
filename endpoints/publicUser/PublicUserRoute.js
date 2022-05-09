const express = require('express');
const PublicUserRouter = express.Router();

const PublicUserService = require('./PublicUserService');


// create user
PublicUserRouter.post('/', (req, res, next) => {
  PublicUserService.createUser(req.body, (msg, user, code) => {
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
PublicUserRouter.get('/', (req, res, next) => {
  PublicUserService.getUsers((msg, users, code) => {
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
PublicUserRouter.get('/:userID', (req, res, next) => {
  PublicUserService.findUserById(req.params.userID, (msg, user, code) => {
    if (user) {
      res.status(code).json(user);
    } else {
      res.status(code).json({
        Error: msg
      });
    }
  });
});

// delete user by ID
PublicUserRouter.delete('/:userID', (req, res, next) => {
  PublicUserService.deleteUserById(req.params.userID, (msg, result, code) => {
    if(result) {
      res.status(code).json({
        Message: msg
      });
    } else {
      res.status(code).json({
        Error: msg
      })
    }
  })
});

// FOR DEV ONLY delete all users
PublicUserRouter.delete('/', (req, res, next) => {
  PublicUserService.deleteAllUsers((err, result) => {
    if(result) {
      res.status(200).json({
        Message: `All users succesfully deleted`
      });
    } else {
      res.status(500).json({
        Error: `Could not delete all users`
      })
    }
  })
});

// update user
PublicUserRouter.put('/:userID', (req, res, next) => {
  PublicUserService.updateUserById(req.params.userID, req.body, (msg, user, code) => {
    if (user) {
      res.status(code).json(user)
    } else {
      res.status(code).json({
        Error: msg
      });
    }
  });
});



module.exports = PublicUserRouter;
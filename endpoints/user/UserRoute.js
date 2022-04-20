const express = require('express');
const UserRouter = express.Router();

const UserService = require('./UserService');


// create user
UserRouter.post('/', (req, res, next) => {
  UserService.createUser(req.body, (err, user) => {
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(500).json({
        Error: 'Something went wrong while creating new user'
      });
    }
  });
});

// get all users
UserRouter.get('/', (req, res, next) => {
  UserService.getUsers((err, users) => {
    if (err) {
      next(err);
    } else {
      res.status(200).json(users);
    }
  });
});

// get user by ID
UserRouter.get('/:userID', (req, res, next) => {
  UserService.findUserById(req.params.userID, (err, user) => {
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({
        Error: `No user with ID ${req.params.userID} found`
      });
    }
  });
});

// delete user by ID
UserRouter.delete("/:userID", (req, res, next) => {
  UserService.deleteUserById(req.params.userID, (err, result) => {
    if(result) {
      /*res.status(200).json({
        Message: `User with ID ${req.params.userID} succesfully deleted`
      })*/
      res.send(result);
    } else {
      res.status(500).json({
        Error: `No user with ID ${req.params.userID} found, therefore deletion failed`
      })
    }
  })
})

UserRouter.post("/:userID/:isAdministrator", (req, res, next) => {
  UserService.changeAdministratorStatus(req.params.userID, req.params.isAdministrator, (err) => {
    if (err) {
      res.status(500).json({
        Error: `Failed to change Administrator status of user with ID ${req.params.userID}`
      });
    } else {
      res.status(200).json({
        Message: `Succesfully changed Adminstrator status of user with ID ${req.params.userID} to ${req.params.isAdministrator}`
      });
    }
  });
});



module.exports = UserRouter;
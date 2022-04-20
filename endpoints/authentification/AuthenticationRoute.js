const express = require('express');
const AuthRouter = express.Router();

const AuthService = require('./AuthentificationService');

AuthRouter.post('/login', (req, res, next) => {
  AuthService.createSessionToken(req.body, (err, token, user) => {
    if (token) {
      res.header('Authorization', 'Bearer', token);

      if (user) {
        const { id, userID, userName, ...partialObject} = user;
        const subset = { id, userID, userName };
        res.send(subset);
      } else {
        console.log('No user found');
        res.send('No user found, created token anyway');
      }
    } else {
      res.send('Could not create token');
    }
  });
});

module.exports = AuthRouter;
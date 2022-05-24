const express = require('express');
const config = require('config');
const https = require('https');
const fs = require('fs');

const bodyparser = require('body-parser');

const app = express();
const port = config.get('app.port');

const key = fs.readFileSync('./cert/key.pem');
const cert = fs.readFileSync('./cert/cert.pem');

const database = require('./database/db');

const PublicUserRouter = require('./endpoints/publicUser/PublicUserRoute');
const UserRouter = require('./endpoints/user/UserRoute');
const AuthRouter = require('./endpoints/authentification/AuthenticationRoute');

const ForumThreadRouter = require('./endpoints/forumThread/ForumThreadRoute');
const ForumMessageRouter = require('./endpoints/forumMessage/ForumMessageRoute');

const UserService = require('./endpoints/user/UserService');

app.use(bodyparser.json());

// routes
app.use('/publicUsers', PublicUserRouter)
app.use('/users', UserRouter);
app.use('/authenticate', AuthRouter);
app.use('/forumThreads', ForumThreadRouter);
app.use('/forumMessages', ForumMessageRouter);

// init DB
database.initDB((err, db) => {
  if (db) {
    UserService.createDefautlAdminUser((msg, user) => {
      if (user) {
        console.log(msg);
      } else {
        console.log(msg);
      }
    });
    console.log("DB connection established");

  } else {
    console.log("DB connection failed");
  }
});

// HTTP error catching
app.use((err, req, res, next) => {
  res.status(500).json({
    Error: err.message
  });
});
app.use((req, res, next) => {
  res.status(404).json({
    Error: 'Ressource not found'
  });
});
app.use((req, res, next) => {
  res.status(400).json({
    Error: 'Bad request'
  });
});

// Start server
https.createServer({
  key: key,
  cert: cert
}, app).listen(port, () => {
  console.log(`Web Engineering II app listening on port ${port}`);
});
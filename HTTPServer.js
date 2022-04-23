const express = require('express');
const bodyparser = require('body-parser');
const app = express();
const { port } = require('./config/config');

const database = require('./database/db');

const PublicUserRouter = require('./endpoints/publicUser/PublicUserRoute');
const UserRouter = require('./endpoints/user/UserRoute');
const AuthRouter = require('./endpoints/authentification/AuthenticationRoute');

const auth = require('./middleware/auth');

app.use(bodyparser.json());

// routes
app.use('/publicUsers', PublicUserRouter)
app.use('/users', auth, UserRouter);
app.use('/authenticate', AuthRouter);

// init DB
database.initDB((err, db) => {
  if (db) {
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
app.listen(port, () => {
  console.log(`Web Engineering app listening on port ${port}`);
});
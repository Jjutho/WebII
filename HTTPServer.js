const express = require('express');
const bodyparser = require('body-parser');
const app = express();
const { port } = require('./config/config');

const database = require('./database/db');

const UserRouter = require('./endpoints/user/UserRoute');
const AuthRouter = require('./endpoints/authentification/AuthenticationRoute');

app.use( bodyparser.json());

app.use('/users', UserRouter);
app.use('/authenticate', AuthRouter);

database.initDB((err, db) => {
  if (db) {
    console.log("DB is connected");
  } else {
    console.log("DB is not connected");
  }
});

app.use((err, req, res, next) => {
  res.status(500).send('Internal Server Error');
});

app.use((req, res, next) => {
  res.status(404).send('URL Not Found');
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
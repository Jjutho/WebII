const mongoose = require('mongoose');
const config = require('config');

let _db;

const connectionString = config.get('db.connectionString');
const dbOptions = config.get('db.dbConfigOptions');

const initDB = (callback) => {
  if (_db) {
    if (callback) {
      return callback(null, _db);
    } else {
      return _db;
    }
  } else {
    mongoose.connect(connectionString, dbOptions);
    _db = mongoose.connection;
    _db.on('error', console.error.bind(console, 'connection error:'));
    _db.once('open', () => {
      callback(null, _db);
    });
  }
}

const returnDB = () => {
  return _db;
}

const closeDB = () => {
  _db.close();
}

module.exports = {
  initDB,
  returnDB,
  closeDB
}
const User = require('./UserModel');

// create user
const createUser = (body, callback) => {
  const { userID, password } = body;
  if (!userID || !password) {
    callback('Please provide userID and password', null, 400);
  } else {
    User.create({
      "userID": body.userID,
      "userName": body.userName || 'Anonymous',
      "isAdministrator": body.isAdministrator || false,
      "password": body.password,
      "email": body.email || ''
    }, (err, user) => {
      if (err) {
        if (err.code == 11000) {
          callback(`User with ID ${body.userID} already exists`, null, 400);
        } else {
          callback(`Creation of user with ID ${body.userID} failed`, null, 500);
        }
      } else {
        const { userID, userName, isAdministrator, email, ...partialObject} = user;
        const subset = { userID, userName, isAdministrator, email};
        user.save(function(err) {
          if (err) {
            callback(`Hashing password of user with ID ${userID} failed`, null, 500);
          } else {
            callback(null, subset, 200);
          }
        });
      }
    });
  }
}

// get all users
const getUsers = (callback) => {
  User.find({}).select({
    "userID": 1,
    "userName": 1,
    "isAdministrator": 1,
    "email": 1,
    "_id": 0
  }).exec((err, users) => {
    if (err) {
      callback('Error while getting users', null, 500);
    } else {
      callback(null, users, 200);
    }
  });
};

// find user by ID
const findUserById = (userID, callback) => {
  User.findOne({userID: userID}).exec((err, user) => {
    if (err) {
      callback(`Getting user with ID ${userID} failed`, null, 500);
    } else {
      if (user) {
        callback(null, user, 200);
      } else {
        if ('admin' == userID) {
          let adminUser = new User({
            userID: 'admin',
            password: '123',
            userName: 'Default Admin Account',
            isAdministrator: true,
            email: 'admin@app.com'
          });
          const { userID, userName, isAdministrator, email, ...partialObject} = adminUser;
          const adminUserSubset = { userID, userName, isAdministrator, email};
        
          adminUser.save(function(err) {
            if (err) {
              callback(`Hashing password of user with ID ${userID} failed`, null, 500);
            } else {
              callback(null, adminUserSubset, 200);
            }
          });
        } else {
          callback(`No user with ID ${userID} found`, null, 404);     
        };
      }
    }
  });
};

// delete user by ID
const deleteUserById = (userID, callback) => {
  User.deleteOne({
    "userID": userID
  }, (err, result) => {
    if (err) {
      callback('Internal Server Error', null, 500);
    } else {
      if (result.deletedCount == 0) {
        callback(`No user with ID ${userID} found`, null, 404);
      } else {
        callback(`User with ID ${userID} succesfully deleted`, true, 200);
      };
    }
  });
}

// FOR DEV ONLY delete all users
const deleteAllUsers = (callback) => {
  User.deleteMany({}, (err, result) => {
    if (err) {
      callback(err);
    } else {
      callback(null, result);
    }
  });
};

// change admin status
const changeAdministratorStatus = (userID, isAdministrator, callback) => {
  if (isAdministrator != 'true' && isAdministrator != 'false') {
    callback('Please provide a valid value for isAdministrator', null, 400);
  } else {
    User.findOneAndUpdate({
      "userID": userID
    }, {
      "isAdministrator": isAdministrator
    }, {
      returnOriginal: false,
      rawResult: true
    }, (err, result) => {
      if (err) {
        callback(`Internal Server Error`, null, 500);
      } else {
        if (result.lastErrorObject.updatedExisting == false) {
          callback(`No user with ID ${userID} found`, null, 404);
        } else {
          callback(null, result.value, 200);
        }
      }
    }).select({
      "userID": 1,
      "userName": 1,
      "isAdministrator": 1,
      "email": 1,
      "_id": 0
    });
  }
}

// update user by ID
const updateUserById = (userID, body, callback) => {
  if (!body.userName || body.userName == '') {
    callback('Please provide a userName', null, 400);
  } else {
    User.findOneAndUpdate({
      "userID": userID
    }, { 
      "userName": body.userName
    }, {
      returnOriginal: false,
      rawResult: true
    },(err, result) => {
      if (err) {
        callback(`Internal Server Error`, null, 500);
      } else {
        if (result.lastErrorObject.updatedExisting == false) {
          callback(`No user with ID ${userID} found`, null, 404);
        } else {
          callback(null, result.value, 200);
        }
      }
    }).select({
      "userID": 1,
      "userName": 1,
      "isAdministrator": 1,
      "email": 1,
      "_id": 0
    });
  }
};

module.exports = {
  createUser,
  getUsers,
  findUserById,
  deleteUserById,
  deleteAllUsers,
  changeAdministratorStatus,
  updateUserById
}
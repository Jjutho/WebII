const User = require('./UserModel');

// create user
const createUser = (body, callback) => {
  User.create({
    "userID": body.userID,
    "userName": body.userName,
    "isAdministrator": body.isAdministrator || false
  }, (err, user) => {
    if (err) {
      callback(err);
    } else {
      const { userID, userName, isAdministrator, ...partialObject} = user;
      const subset = { userID, userName, isAdministrator};
      callback(null, subset);
    }
  })
}

// get all users
const getUsers = (callback) => {
  let query = User.find({}).select({
    "userID": 1,
    "userName": 1,
    "isAdministrator": 1,
    "_id": 0
  }, (err, users) => {
    if (err) {
      callback(err);
    } else {
      callback(null, users);
    }
  });
};

// find user by ID
const findUserById = (userID, callback) => {
  if(!userID) {
    return;
  }

  let query = User.findOne({userID: userID}).select({
    "userID": 1,
    "userName": 1,
    "isAdministrator": 1,
    "_id": 0
  });
  query.exec((err, user) => {
    if (err) {
      console.log(err);
      callback(err);
    } else {
      if (user) {
        console.log('User found: ' + user.userID);
        callback(null, user);
      } else {
        if ('admin' == userID) {
          let adminUser = new User({
            userID: 'admin',
            password: '123',
            userName: 'Default Admin Account',
            isAdministrator: true
          });

          adminUser.save((err) => {
            if (err) {
              console.log(err);
              callback(err);
            } else {
              console.log('Default admin account created');
              callback(null, adminUser);
            }
          });
        } else {
          console.log('User not found: ' + userID);
          callback(null, user);
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
    if (result.deletedCount == 0) {
      callback(err);
    } else {
      callback(null, result);
    }
  });
}

// change admin status
const changeAdministratorStatus = (userID, isAdminstrator, callback) => {
  User.updateOne({
    "userID": userID
  }, {
    "isAdministrator": isAdminstrator
  }, (err, result) => {
    if (result.nModified == 0) {
      callback(err);
    } else {
      callback(null, result);
    }
  });
}

module.exports = {
  createUser,
  getUsers,
  findUserById,
  deleteUserById
}
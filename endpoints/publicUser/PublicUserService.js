const User = require('../user/UserModel');

// create user
const createUser = (body, callback) => {
  const { userID, password } = body;
  if (!userID) {
    callback('Please provide a userID', null, 400);
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
          callback(`User with ID ${body.userID} already exists`, null, 409);
        } else {
          callback(`Creation of user with ID ${body.userID} failed`, null, 500);
        }
      } else {
        const { userID, userName, isAdministrator, password, email, createdAt, ...partialObject} = user;
        const subset = { userID, userName, isAdministrator, password, email, createdAt};
        callback(null, subset, 200);
      }
    });
  }
}

// get all users
const getUsers = (callback) => {
  User.find({}).select({
    "_id": 0,
    "__v": 0
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
  User.findOne({"userID": userID}).select({
    "_id": 0,
    "__v": 0
  }).exec((err, user) => {
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
          const { userID, userName, isAdministrator, password, email, createdAt, ...partialObject} = adminUser;
          const adminUserSubset = { userID, userName, isAdministrator, password, email, createdAt};
        
          adminUser.save((err) => {
            if (err) {
              callback(`Saving user with ID ${userID} failed`, null, 500);
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
        callback(`User with ID ${userID} succesfully deleted`, true, 204);
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

// update user by ID
const updateUserById = (userID, body, callback) => {
  User.findOne({"userID": userID}, (err, user) => {
    if (user) {
      Object.assign(user, body);
      user.save((err) => {
        if (err) {
          callback(err, null, 500);
        } else {
          const { userID, userName, isAdministrator, password, email, createdAt, updatedAt, ...partialObject} = user;
        const subset = { userID, userName, isAdministrator, password, email, createdAt, updatedAt};
          callback(null, subset, 200);
        }
      });
    } else {
      callback(`No user with ID ${userID} found`, null, 404);
    }
  });
};

module.exports = {
  createUser,
  getUsers,
  findUserById,
  deleteUserById,
  deleteAllUsers,
  updateUserById
}
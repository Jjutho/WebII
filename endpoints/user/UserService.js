const User = require('./UserModel');

// create user
const createUser = (body, callback) => {
  const { userID } = body;
  if (!userID) {
    callback('Please provide a userID', null, 400);
  } else {
    User.create({
      "userID": body.userID,
      "userName": body.userName || 'Anonymous',
      "isAdministrator": body.isAdministrator || false,
      "password": body.password || '',
      "email": body.email || ''
    }, (err, user) => {
      if (err) {
        if (err.code == 11000) {
          callback(`User with ID ${body.userID} already exists`, null, 400);
        } else {
          callback(`Creation of user with ID ${body.userID} failed`, null, 500);
        }
      } else {
        const { userID, userName, isAdministrator, email } = user;
        const subset = { userID, userName, isAdministrator, email};
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
      let filteredUsers = users.map(user => {
        const { userID, userName, isAdministrator, email } = user;
        return { userID, userName, isAdministrator, email};
      });
      callback(null, filteredUsers, 200);
    }
  });
};

// find user by ID
const findUserById = (userID, callback, filter) => {
  User.findOne({userID: userID}).exec((err, user) => {
    if (err) {
      callback(`Getting user with ID ${userID} failed`, null, 500);
    } else {
      if (user) {
        if (filter) {
          const { userID, userName, isAdministrator, email } = user;
          const subset = { userID, userName, isAdministrator, email};
          callback(null, subset, 200);
        } else {
          callback(null, user, 200);
        }
      } else {
        callback(`No user with ID ${userID} found`, null, 404);     
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
          const { userID, userName, isAdministrator, email } = user;
        const subset = { userID, userName, isAdministrator, email };
          callback(null, subset, 200);
        }
      });
    } else {
      callback(`No user with ID ${userID} found`, null, 404);
    }
  });
};

const createDefautlAdminUser = (callback) => {
  User.findOne({userID: 'admin'}, (err, user) => {
    if (err) {
      callback("Error while creating default admin user.", null);
    } else {
      if (!user) {
        User.create({
          "userID": 'admin',
          "userName": 'Admin',
          "isAdministrator": true,
          "password": '123',
          "email": 'admin@app.de'
        }, (err, user) => {
          if (err) {
            callback("Error while creating default admin user."), null;
          } else {
            callback("Default admin user created.", user);
          }
        }
        );
      } else {
        callback("Admin account confirmed.", null);
      }
    }
  }
  );
};

module.exports = {
  createUser,
  getUsers,
  findUserById,
  deleteUserById,
  deleteAllUsers,
  updateUserById,
  createDefautlAdminUser
}
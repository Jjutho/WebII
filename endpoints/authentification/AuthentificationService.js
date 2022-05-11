const UserService = require('../user/UserService');
const jwt = require('jsonwebtoken');
const config = require('config');

const createSessionToken = (props, callback) => {
  if (!props) {
    callback('No props provided', null, null, 400);
  } 
  const login = Buffer.from(props.split(" ")[1], 'base64').toString();
  const userID = login.split(":")[0];
  const password = login.split(":")[1];
  UserService.findUserById(userID, function(msg, user, code) {
    if (user) {
      user.comparePassword(password, function(err, isMatch) {
        if (err) {
          callback('Internal Server Error', null, null, 500);
        } else {
          if (isMatch) {
            let issuedAt = new Date().getTime();
            let expirationTime = config.get('session.timeout');
            let expiresAt = issuedAt + ( expirationTime * 1000 );
            let privateKey = config.get('session.tokenKey');

            const token = jwt.sign(
              { 
                "userID": user.userID,
                "userName": user.userName,
                "isAdministrator": user.isAdministrator
              },
              privateKey,
              { 
                expiresIn: expiresAt,
                algorithm: 'HS256'
              }
            );

            const { userID, userName, isAdministrator, email } = user;
            const subset = { userID, userName, isAdministrator, email};
            callback(`Token created successfully`, token, subset, 200);
          } else {
            callback(`Failed to create token: Authentication failed`, null, null, 401);
          }
        }
      });
    } else {
      callback(`Failed to create token: No user with ID ${props.userID} found`, null, null, 404);
    }
  }, false);
}

module.exports = {
  createSessionToken
}
const UserService = require('../user/UserService');
const jwt = require('jsonwebtoken');
const config = require('config');

createSessionToken = (props, callback) => {
  if (!props) {
    callback('No props provided');
    return;
  } 
  
  UserService.findUserById(props.userID, function(err, user) {
    if (user) {
      user.comparePassword(props.password, function(err, isMatch) {
        if (err) {
          console.log(err);
          callback(err);
        } else {
          if (isMatch) {

            let issuedAt = new Date().getTime();
            let expirationTime = config.get('session.timeout');
            let expiresAt = issuedAt + ( expirationTime * 1000 );
            let privateKey = config.get('session.tokenKey');

            const token = jwt.sign(
              { "user": user.userID },
              privateKey,
              { 
                expiresIn: expiresAt,
                algorithm: 'HS256'
              });
            
            console.log('Token created');
            callback(null, token, user);
          } else {
            console.log('Password does not match');
            callback(err);
          }
        }
      });
    }
  });
}

module.exports = {
  createSessionToken
}
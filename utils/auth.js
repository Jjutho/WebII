const jwt = require('jsonwebtoken');
const config = require('config');

const isAuthenticated = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(' ')[1];
    const privateKey = config.get('session.tokenKey');
    jwt.verify(token, privateKey, { algorithm: 'HS256'}, (err, user) => {
      if (err) {
        res.status(401).json({
          Error: 'Failed to authenticate token'
        });
      } else {
        req.user = user;
        next();
      }
    }
    );
  } else {
    res.status(401).json({
      Error: 'No token provided'
    });
  }
}

const isAdministrator = (req, res, next) => {
  if (req.user.isAdministrator) {
    next();
  } else {
    res.status(401).json({
      Error: 'Not authorized'
    });
  }
}


module.exports = {
  isAuthenticated,
  isAdministrator
};
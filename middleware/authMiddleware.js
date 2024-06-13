const jwt = require('jsonwebtoken');
const { User } = require('../models');

const authenticate = async (req, res, next) => {
  try {
    let token = req.header('Authorization');
    if (!token) {
      return res.status(401).json({ message: 'Authentication failed. Token missing' });
    }
    token = token.replace('Bearer ', '');

    const decoded = jwt.decode(token);


    if (!decoded) {
      return res.status(401).json({ message: 'Authentication failed. Invalid token' });
    }

    if (decoded.user_type === 'user') {
      const user = await User.findByPk(decoded.id);

      if (!user) {
        return res.status(401).json({ message: 'Invalid User Token' });
      }
      req.authenticatedUser = decoded;
      next();
    } else if (decoded.user_type === 'admin') {
      const admin = await Admin.findByPk(decoded.id);
      if (!admin) {
        return res.status(401).json({ message: 'Invalid  Admin Token' });
      }
      req.authenticatedUser = decoded;
      next();
    } else {
      return res.status(401).json({ message: 'Authentication failed. Invalid user type' });
    }
  } catch (error) {
    res.status(401).json({ message: 'Authentication failed. Invalid token' });
  }
};


const authorizeUser = async (req, res, next) => {
  if (req.authenticatedUser.user_type === 'user') {
    next();
  } else {
    res.status(403).json({ message: 'Access forbidden for non-user users' });
  }
};

module.exports = {
  authenticate,
  authorizeUser
};

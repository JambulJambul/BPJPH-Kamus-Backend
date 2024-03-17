const jwt = require('jsonwebtoken');
const { User } = require('../models'); // Import your User and Admin models

const authenticate = async (req, res, next) => {
  try {
    let token = req.header('Authorization');

    console.log(token, 'Ini Token');

    if (!token) {
      return res.status(401).json({ message: 'Authentication failed. Token missing' });
    }

    // Remove "Bearer " prefix from the token
    token = token.replace('Bearer ', ''); // Remove the "Bearer " prefix if present

    console.log(token, 'Ini Token 22');

    // Determine the secret key based on the token
    const decoded = jwt.decode(token); // Decoding the token to access its payload

    console.log(decoded , 'decoded')

    if (!decoded) {
      return res.status(401).json({ message: 'Authentication failed. Invalid token' });
    }

    if (decoded.user_type === 'user') {
      // secretKey = 'USER-SECRET-KEY';
      const user = await User.findByPk(decoded.id);

      if (!user) {
        return res.status(401).json({ message: 'Invalid User Token' });
      }
      req.authenticatedUser = decoded;
      next();
    } else if (decoded.user_type === 'admin') {
      const admin = await Admin.findByPk(decoded.id);

      // secretKey = 'ADMIN-SECRET-KEY';

      if (!admin) {
        return res.status(401).json({ message: 'Invalid  Admin Token' });
      }
      req.authenticatedUser = decoded; // Attach the authenticated admin object to the request
      next();
    } else {
      return res.status(401).json({ message: 'Authentication failed. Invalid user type' });
    }
  } catch (error) {
    console.error(error);
    res.status(401).json({ message: 'Authentication failed. Invalid token' });
  }
};


const authorizeUser =  async(req, res, next) => {
  if (req.authenticatedUser.user_type === 'user') {
    next(); // User is authorized as 'admin', proceed to the next middleware
  } else {
    res.status(403).json({ message: 'Access forbidden for non-user users' });
  }
};

module.exports = {
  authenticate,
  authorizeUser
};

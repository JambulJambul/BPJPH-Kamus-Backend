const jwt = require('jsonwebtoken');

const generateUserAuthToken = (user) => {
  const payload = {
    id: user.id,
    email: user.email,
    role: user.role,
    username: user.username
  };

  const token = jwt.sign(payload, process.env.TOKEN_KEY, { expiresIn: '7d' });

  return token;
};

module.exports = { generateUserAuthToken };
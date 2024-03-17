const jwt = require('jsonwebtoken');

// Function to generate a JWT token for Users
const generateUserAuthToken = (user) => {
  const payload = {
    id: user.id,
    email: user.email,
    user_type:user.user_type
    // Add any other user-related data you want to include in the token
  };

  // Sign the token with the user secret key and set an expiration time (e.g., 30 minutes)
  const token = jwt.sign(payload, 'USER-SECRET-KEY', { expiresIn: '30m' });

  return token;
};

// Function to generate a JWT token for Admins
const generateAdminAuthToken = (admin) => {
  const payload = {
    id: admin.id,
    email: admin.email,
    user_type:admin.user_type

    // Add any other admin-related data you want to include in the token
  };
  console.log(payload , 'PAYLOAD ADMIN')
  // Sign the token with the admin secret key and set an expiration time (e.g., 30 minutes)
  const token = jwt.sign(payload, 'ADMIN-SECRET-KEY', { expiresIn: '30m' });

  return token;
};

module.exports = { generateUserAuthToken, generateAdminAuthToken };

const { User } = require('../models'); // Assuming you have a User model
const { userSchema } = require('../helpers/validateAttribute'); // Your Joi validation schema
const { comparePasswords, hashPassword  } = require('../utils/bcrypt'); // Import the comparePasswords function
const {generateUserAuthToken } = require('../utils/generateAuthToken'); // Import the generateAuthToken function


// Controller methods for user-related operations
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    res.status(200).json({ data: users, message: 'Success' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

exports.getUserById = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ data: user, message: 'Success' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

exports.registerUser = async (req, res) => {
  const { email , password } = req.body;

  const { error } = userSchema.validate({ email , password });

  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  try {
    // Check if the email is already in use
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already in use' });
    }

     // Hash the password
     const hashedPassword = await hashPassword(password);

    // Create a new user
    const newUser = await User.create({ email , password : hashedPassword });

    // Generate a JWT token for the newly registered user
    const token = generateUserAuthToken(newUser);

    res.status(201).json({ message: 'User registered successfully', token, data: newUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find the user by email
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: 'Authentication failed. User not found' });
    }

    // Verify the password
    const isPasswordMatch = await comparePasswords(password, user.password);
    if (!isPasswordMatch) {
      return res.status(401).json({ message: 'Authentication failed. Incorrect password' });
    }
    let modifiedUser = {
      id: user.id,
      email: user.email,
      user_type:'user'
    }
    // Generate and send a JWT token
    const token = generateUserAuthToken(modifiedUser);
    res.status(200).json({ message: 'Authentication successful', token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

exports.updateUser = async (req, res) => {
  const { id } = req.params;
  const { email , password } = req.body;

  const { error } = userSchema.validate({ email , password });

  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  try {
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update user data
    await user.update({ email , password });
    res.status(200).json({ message: 'User updated successfully', data: user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

exports.deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Delete the user
    await user.destroy();
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};


exports.forgotPassword = async (req, res) => {
  const { email } = req.params; // Use email from req.params
  const { password } = req.body;

  try {
    // Find the user by email
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Hash the new password
    const hashedPassword = await hashPassword(password);

    // Update the user's password
    await user.update({ password: hashedPassword });
    res.status(200).json({ message: 'Password reset successfully', data: user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};


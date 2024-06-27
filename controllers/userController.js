const { User } = require('../models');
const { userSchema, registrationSchema } = require('../helpers/validateAttribute');
const jwt = require('jsonwebtoken')
const { comparePasswords, hashPassword } = require('../utils/bcrypt');
const { generateUserAuthToken } = require('../utils/generateAuthToken');
const decryptor = require('../utils/decryptor')

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
  const decryptedData = decryptor.decryptObject(req.body);
  const { email, password, username } = decryptedData;
  const { error } = registrationSchema.validate({ email, password, username });

  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  try {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already in use' });
    }
    const hashedPassword = await hashPassword(password);
    const newUser = await User.create({ email, password: hashedPassword });
    res.status(201).json({ message: 'User registered successfully', data: newUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

exports.loginUser = async (req, res) => {
  const decryptedData = decryptor.decryptObject(req.body);
  const { email, password } = decryptedData;

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: 'Authentication failed. User not found' });
    }

    const isPasswordMatch = await comparePasswords(password, user.password);
    if (!isPasswordMatch) {
      return res.status(401).json({ message: 'Authentication failed. Incorrect password' });
    }
    let modifiedUser = {
      id: user.id,
      email: user.email,
      role: user.role,
      username: user.username
    }
    const token = generateUserAuthToken(modifiedUser);
    res.status(200).json({ message: 'Authentication successful', token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

exports.updateUser = async (req, res) => {
  const { id } = req.params;
  const { email, password } = req.body;

  const { error } = userSchema.validate({ email, password });

  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  try {
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await user.update({ email, password });
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

    await user.destroy();
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};


exports.forgotPassword = async (req, res) => {
  const { email } = req.params;
  const { password } = req.body;

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const hashedPassword = await hashPassword(password);

    await user.update({ password: hashedPassword });
    res.status(200).json({ message: 'Password reset successfully', data: user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

exports.checkAdmin = async (req, res) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.TOKEN_KEY);
    const user = await User.findByPk(decoded.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.role === '1') {
      return res.status(200).json({ message: 'You are an admin' });
    } else {
      return res.status(403).json({ message: 'You are not an admin' });
    }
  } catch (error) {
    console.error('Token verification failed:', error);
    return res.status(401).json({ message: 'Invalid token' });
  }
};
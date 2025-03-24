const User = require('../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');


// Register a new user
exports.registerUser = async (req, res) => {
  const { name, email, phoneNumber, password, role } = req.body;

  if (!name || !email || !phoneNumber || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    // Check if the user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Set default role to 'user' if not provided
    const userRole = role || 'user';

    // Create new user
    const newUser = await User.create({ name, email, phoneNumber, password, role: userRole });
    res.status(201).json({ message: 'User registered successfully', user: newUser });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


// Login a user
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check if the password matches
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Create a JWT token with the user's id and role
    const token = jwt.sign(
      { id: user._id, role: user.role },  // Include the role in the payload
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    // Return the token and user details (without password)
    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phoneNumber: user.phoneNumber,
        role: user.role,  // Include role in the response
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


// Get current user
exports.getCurrentUser = async (req, res) => {
  console.log("requesting /me")
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all users - This function will be added
exports.getAllUsers = async (req, res) => {
  try {
    // Check if the user making the request is an admin
    // if (req.user.role !== user) {
    //   return res.status(403).json({ message: 'Access denied. Only admins can view all users.' });
    // }

    // Fetch all users except their passwords
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

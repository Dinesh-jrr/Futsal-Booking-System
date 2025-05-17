const User = require('../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const EmailOtp = require('../models/emailOtp'); // MongoDB model for storing OTPs

// Register a new user (without sending OTP here)
exports.registerUser = async (req, res) => {
  const { name, email, phoneNumber, password, role } = req.body;

  if (!name || !email || !phoneNumber || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const userExists = await User.findOne({ email });

    if (userExists) {
      if (!userExists.isVerified) {
        // ✅ User exists but not verified – allow resend OTP on frontend
        return res.status(400).json({
          message: 'User already exists but not verified',
          isVerified: false,          // Optional for compatibility
          status: 'unverified',       // ✅ Use this in frontend check
        });
      }

      return res.status(400).json({
        message: 'User already exists',
        isVerified: true,
      });
    }

    const userRole = role || 'user';
    const newUser = await User.create({
      name,
      email,
      phoneNumber,
      password,
      role: userRole,
      isVerified: false,
    });

    res.status(201).json({
      message: 'User registered successfully. Please verify your email with the OTP.',
      status: 'created',
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};



// Verify email OTP
exports.verifyEmailOtp = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const record = await EmailOtp.findOne({ email, otp });
    if (!record) return res.status(400).json({ message: 'Invalid or expired OTP' });

    if (Date.now() > record.expiresAt) {
      console.log("🔍 Debug - OTP Record:", record);
console.log("🕒 Now:", Date.now());
console.log("📅 Expires At:", new Date(record.expiresAt).getTime());
console.log("⏳ Diff (ms):", new Date(record.expiresAt).getTime() - Date.now());

      await EmailOtp.deleteOne({ _id: record._id });
      return res.status(400).json({ message: 'OTP has expired' });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.isVerified = true;
    await user.save();
    await EmailOtp.deleteOne({ _id: record._id });

    res.status(200).json({ message: 'Email verified successfully' });
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
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    if (!user.isVerified) return res.status(403).json({ message: 'Please verify your email before logging in.' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phoneNumber: user.phoneNumber,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Controller function to fetch user details by userId
exports.getUserDetails = async (req, res) => {
  try {
    const { userId } = req.params;

    // Find the user in the database by userId
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Return user details (you can modify what data you want to send back)
    res.status(200).json({ success: true, user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};



// Get current user
exports.getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Forgot password
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await EmailOtp.deleteMany({ email });
    await EmailOtp.create({ email, otp, expiresAt });

    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: 'your_email@gmail.com',
        pass: 'fnwu dytl gzqv jlqz',
      },
    });

    await transporter.sendMail({
      to: email,
      subject: 'Your OTP for Password Reset',
      html: `<h2>Your OTP is ${otp}</h2><p>It is valid for 10 minutes.</p>`,
    });

    res.status(200).json({ message: 'OTP sent to email' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Reset password
exports.resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;

  try {
    const record = await EmailOtp.findOne({ email, otp });
    if (!record) return res.status(400).json({ message: 'Invalid or expired OTP' });

    if (Date.now() > record.expiresAt) {
      await EmailOtp.deleteOne({ _id: record._id });
      return res.status(400).json({ message: 'OTP expired' });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    await EmailOtp.deleteOne({ _id: record._id });

    res.status(200).json({ message: 'Password reset successful' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

//send otp
exports.sendOtpToEmail = async (req, res) => {
  const { email } = req.body;

  if (!email) return res.status(400).json({ message: "Email is required" });

  try {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 min expiry

    // Delete existing OTPs for this email
    await EmailOtp.deleteMany({ email });
    await EmailOtp.create({ email, otp, expiresAt });

    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: 'jrdinesh1@gmail.com',
        pass: 'fnwu dytl gzqv jlqz', // Use App Password for Gmail
      },
    });

    await transporter.sendMail({
      to: email,
      subject: 'Your OTP for Futsal Booking',
      html: `<h2>Your OTP is: ${otp}</h2><p>This OTP is valid for 10 minutes.</p>`,
    });

    res.status(200).json({ message: "OTP sent to email successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Failed to send OTP", error: error.message });
  }
};


// Controller to update user profile
exports.updateUserProfile = async (req, res) => {
  try {
    const { userId } = req.params;  // Extract userId from the URL

    // Find the user by userId
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Update the user details with the provided data from the request body
    const updatedData = req.body;
    for (let key in updatedData) {
      if (updatedData[key] !== undefined) {
        user[key] = updatedData[key];
      }
    }

    // Save the updated user
    await user.save();

    // Send the updated user data as a response
    res.status(200).json({ success: true, user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

//update password change
exports.changePassword = async (req, res) => {
  try {
    const { userId } = req.params;  // Extract userId from the URL, or get it from session if needed
    const { currentPassword, newPassword } = req.body;

    // Find the user by userId
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Check if the current password matches
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Current password is incorrect' });
    }

    // Validate the new password (optional - can be customized)
    if (newPassword === currentPassword) {
      return res.status(400).json({ success: false, message: 'New password must be different from the current password' });
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update the user's password
    user.password = hashedPassword;

    // Save the updated user
    await user.save();

    // Send the updated user data as a response (excluding password)
    res.status(200).json({ success: true, message: 'Password changed successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

//get user by email
exports.getUserByEmail = async (req, res) => {
  try {
    const { email } = req.params;

    const user = await User.findOne({ email }).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ success: true, user });
  } catch (error) {
    console.error("getUserByEmail error:", error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Search users by partial email
exports.searchUsersByEmail = async (req, res) => {
  const query = req.query.query;
  if (!query) return res.json({ users: [] });

  try {
    const users = await User.find({ email: { $regex: query, $options: 'i' } })
      .select('name email _id') // include name here
      .limit(10);

    res.json({ users });
  } catch (error) {
    res.status(500).json({ message: 'Search failed', error: error.message });
  }
};



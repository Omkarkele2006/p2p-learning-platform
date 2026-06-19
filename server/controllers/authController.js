const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const axios = require('axios');
const sendEmail = require('../utils/sendEmail');
// Generate Token helper function
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};


// @desc    Login with GitHub
// @route   POST /api/auth/github
exports.githubLogin = async (req, res) => {
  const { code } = req.body;

  try {
    // 1. Exchange the 'code' for an 'access_token'
    const tokenResponse = await axios.post(
      'https://github.com/login/oauth/access_token',
      {
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code,
      },
      { headers: { Accept: 'application/json' } }
    );

    const accessToken = tokenResponse.data.access_token;
    if (!accessToken) return res.status(400).json({ message: 'GitHub authentication failed' });

    // 2. Fetch User Profile using the access_token
    const userResponse = await axios.get('https://api.github.com/user', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    // 3. Fetch User Email (GitHub emails can be private, so we fetch them explicitly)
    const emailResponse = await axios.get('https://api.github.com/user/emails', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    const githubUser = userResponse.data;
    // Find the primary, verified email
    const primaryEmail = emailResponse.data.find(e => e.primary && e.verified)?.email || githubUser.email;

    // 4. Check if user exists in DB
    let user = await User.findOne({ email: primaryEmail });

    if (!user) {
      // If new user, create them with a dummy password
      user = await User.create({
        name: githubUser.name || githubUser.login, // GitHub 'name' can be null
        email: primaryEmail,
        password: Math.random().toString(36).slice(-8), // Random password
        skills: [],
        interests: []
      });
    }

    // 5. Generate JWT and send back
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });

  } catch (error) {
    console.error("GitHub Login Error:", error.response?.data || error.message);
    res.status(500).json({ message: 'GitHub Login Failed' });
  }
};

exports.registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'User already exists' });

    const user = await User.create({ name, email, password });
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Forgot Password - Send OTP
// @route   POST /api/auth/forgot-password
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user)
      return res.status(404).json({ message: 'User not found' });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    await User.updateOne(
      { email },
      {
        otp,
        otpExpires: Date.now() + 10 * 60 * 1000
      }
    );

    await sendEmail({
      email: user.email,
      subject: 'Your Password Reset OTP',
      message: `Your OTP is: ${otp}. It expires in 10 minutes.`
    });

    res.json({ message: 'OTP sent to email' });

  } catch (error) {
    console.error("Email Error:", error);
    res.status(500).json({ message: 'Email could not be sent' });
  }
};


// @desc    Reset Password
// @route   POST /api/auth/reset-password
exports.resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;

  try {
    const user = await User.findOne({
      email,
      otp,
      otpExpires: { $gt: Date.now() }
    });

    if (!user)
      return res.status(400).json({ message: 'Invalid or Expired OTP' });

    user.password = newPassword;
    user.otp = undefined;
    user.otpExpires = undefined;

    await user.save(); // Middleware hashes password

    res.json({ message: 'Password Reset Successful' });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });

    // Compare entered password with hashed password in DB
    if (user && (await bcrypt.compare(password, user.password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
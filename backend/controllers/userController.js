import User from '../models/userModel.js';
import jwt from 'jsonwebtoken';

// 🔑 Helper function to generate structural web tokens
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'sridhara_secret_key_98765', {
    expiresIn: '30d',
  });
};

// @desc    Auth user & get token (Standard Login)
// @route   POST /api/users/login
export const authUser = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    // 🛡️ Normalize input string to prevent casing and whitespace validation mismatches
    const normalizedEmail = email ? email.toLowerCase().trim() : '';

    const user = await User.findOne({ email: normalizedEmail });
    
    if (user && (await user.matchPassword(password))) {
      return res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        token: generateToken(user._id),
      });
    } else {
      res.status(401);
      return res.json({ message: 'Invalid email or password credentials' });
    }
  } catch (error) {
    console.error('❌ ERROR IN AUTH_USER CONTROLLER:', error);
    res.status(500);
    return res.json({ message: error.message });
  }
};

// @desc    Register a new user account
// @route   POST /api/users
export const registerUser = async (req, res, next) => {
  const { name, email, password } = req.body;
  try {
    // 🛡️ Always normalize emails before writing to your MongoDB Atlas Cluster
    const normalizedEmail = email ? email.toLowerCase().trim() : '';

    const userExists = await User.findOne({ email: normalizedEmail });
    if (userExists) {
      res.status(400);
      return res.json({ message: 'User already exists with that email address' });
    }

    const user = await User.create({ 
      name, 
      email: normalizedEmail, 
      password 
    });

    if (user) {
      return res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        token: generateToken(user._id),
      });
    } else {
      res.status(400);
      return res.json({ message: 'Invalid user profile data provided' });
    }
  } catch (error) {
    console.error('❌ ERROR IN REGISTER_USER CONTROLLER:', error);
    res.status(500);
    return res.json({ message: error.message });
  }
};

// @desc    Authenticate or JIT register users via Phone Verification
// @route   POST /api/users/verify-otp
export const authUserByPhone = async (req, res, next) => {
  const { phone, email, name } = req.body;
  try {
    console.log('📱 Phone Auth Request Received:', { phone, email, name });

    const normalizedEmail = email ? email.toLowerCase().trim() : '';

    let user = await User.findOne({
      $or: [
        { email: normalizedEmail || 'never-match-empty' },
        { phone: phone || 'never-match-empty' } 
      ]
    });

    // Just-In-Time (JIT) provisioning for new phone records
    if (!user) {
      console.log('👤 User not found. Instantiating JIT user setup profile...');
      user = await User.create({
        name: name || `Phone User ${phone?.slice(-4) || 'New'}`,
        email: normalizedEmail || `${phone || Date.now()}@swiftshop.temporary`,
        phone: phone, 
        password: Math.random().toString(36).slice(-8), 
      });
    }

    return res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user._id),
    });
  } catch (error) {
    console.error('❌ CRITICAL PHONE CONTROLLER ENGINE EXCEPTION:', error);
    res.status(500);
    return res.json({ message: `Phone gateway integration failure: ${error.message}` });
  }
};

// @desc    Get user profile details
// @route   GET /api/users/profile
export const getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (user) {
      return res.json({ _id: user._id, name: user.name, email: user.email, isAdmin: user.isAdmin });
    } else {
      res.status(404);
      return res.json({ message: 'User data profile not found' });
    }
  } catch (error) {
    console.error('❌ ERROR IN GET_USER_PROFILE CONTROLLER:', error);
    res.status(500);
    return res.json({ message: error.message });
  }
};

// @desc    Update user profile details
// @route   PUT /api/users/profile
export const updateUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (user) {
      user.name = req.body.name || user.name;
      
      if (req.body.email) {
        user.email = req.body.email.toLowerCase().trim();
      }

      // 🛡️ REMODLED SAFEGUARD: 
      // If a brand new password was typed into the profile form, update it directly.
      // Your userModel's pre('save') hook tracks `this.isModified('password')` natively.
      // If the field is empty, we completely ignore it, ensuring the existing hash is untouched!
      if (req.body.password && req.body.password.trim() !== '') {
        user.password = req.body.password;
      }

      const updatedUser = await user.save();
      return res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        isAdmin: updatedUser.isAdmin,
        token: generateToken(updatedUser._id),
      });
    } else {
      res.status(404);
      return res.json({ message: 'User not found' });
    }
  } catch (error) {
    console.error('❌ ERROR IN UPDATE_USER_PROFILE CONTROLLER:', error);
    res.status(500);
    return res.json({ message: error.message });
  }
};

// @desc    Sync password resets from forgot password utilities
// @route   POST /api/users/reset-password
export const resetPassword = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const normalizedEmail = email ? email.toLowerCase().trim() : '';
    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      res.status(404);
      return res.json({ message: 'No registered account found with that email address' });
    }

    // Force updates the password string. The model's pre('save') hook registers
    // this modification and builds a pristine new hash round cleanly!
    user.password = password; 
    await user.save(); 

    return res.status(200).json({ message: 'Database credentials synchronized completely!' });
  } catch (error) {
    console.error('❌ ERROR IN RESET_PASSWORD CONTROLLER:', error);
    res.status(500);
    return res.json({ message: error.message });
  }
};
import express from 'express';
const router = express.Router();
import {
  authUser,
  registerUser,
  getUserProfile,
  updateUserProfile,
  authUserByPhone,
  resetPassword, // 👈 ADDED: Import your fresh password reset handler
} from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';

// 🔐 Standard Authentication & Login Endpoints
router.post('/login', authUser);
router.post('/auth', authUser); // Fallback for alternative login actions

// 📝 User Registration Endpoints
router.post('/', registerUser);       // Handles POST to /api/users
router.post('/register', registerUser); // Explicitly handles POST to /api/users/register
router.post('/signup', registerUser);   // Explicitly handles POST to /api/users/signup

// 🔑 Password Synchronization Gateway
router.post('/reset-password', resetPassword); // 👈 ADDED: Handles password updates from forgot-password views

// 📱 Phone & OTP Gateway Verification Endpoints
router.post('/phone-login', authUserByPhone);
router.post('/verify-otp', authUserByPhone); // Matches the path your frontend OTP form submits to

// 👤 Protected User Profile Management Endpoints
router.route('/profile')
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);

export default router;
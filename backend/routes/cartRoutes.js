import express from 'express';
const router = express.Router();
import { getUserCart, updateUserCart } from '../controllers/cartController.js';
import { protect } from '../middleware/authMiddleware.js'; // Adjust path if needed

router.route('/')
  .get(protect, getUserCart)
  .put(protect, updateUserCart);

export default router;
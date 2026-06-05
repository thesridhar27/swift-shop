import express from 'express';
const router = express.Router();
import { 
  addOrderItems, 
  getOrderById, 
  getMyOrders 
} from '../controllers/orderController.js';
import { protect } from '../middleware/authMiddleware.js';

// 📝 Order Creation Pipelines
router.route('/').post(protect, addOrderItems);
router.route('/create').post(protect, addOrderItems); // 👈 Fallback support for explicit endpoint dispatching

// 👤 User Order History Pipeline
// ⚠️ CRITICAL: Must sit ABOVE /:id so Express does not parse 'myorders' as an ID string variable!
router.route('/myorders').get(protect, getMyOrders);

// 🔍 Individual Detailed Order Extraction Lookup
router.route('/:id').get(protect, getOrderById);

export default router;
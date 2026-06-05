import express from 'express';
const router = express.Router();
import Product from '../models/productModel.js';

// @desc    Fetch all products from MongoDB Atlas (Homepage)
// @route   GET /api/products
router.get('/', async (req, res) => {
  try {
    const products = await Product.find({});
    res.json(products);
  } catch (error) {
    console.error('❌ Error fetching all products:', error);
    res.status(500).json({ message: error.message });
  }
});

// @desc    Fetch a single product by ID (Product Detail Page)
// @route   GET /api/products/:id
// 💡 FIXED: This handles incoming requests whenever you click an individual product!
router.get('/:id', async (req, res) => {
  try {
    // Look up the unique MongoDB _id from the URL string parameters
    const product = await Product.findById(req.params.id);

    if (product) {
      return res.json(product);
    } else {
      res.status(404).json({ message: 'Product asset not found in our catalog' });
    }
  } catch (error) {
    console.error(`❌ Error fetching product with ID ${req.params.id}:`, error);
    res.status(500).json({ message: `Invalid Product ID format error: ${error.message}` });
  }
});

export default router;
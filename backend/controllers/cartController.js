import Cart from '../models/cartModel.js';

// @desc    Get logged in user's saved cart
// @route   GET /api/cart
// @access  Private
export const getUserCart = async (req, res) => {
  // req.user._id comes from your protect middleware
  const cart = await Cart.findOne({ user: req.user._id });

  if (cart) {
    res.json(cart.cartItems);
  } else {
    res.json([]); // Return empty array if no cart saved yet
  }
};

// @desc    Update or create user's saved cart items
// @route   PUT /api/cart
// @access  Private
export const updateUserCart = async (req, res) => {
  const { cartItems } = req.body;

  // Find existing cart or update it; if it doesn't exist, create it (upsert)
  const cart = await Cart.findOneAndUpdate(
    { user: req.user._id },
    { cartItems },
    { new: true, upsert: true }
  );

  if (cart) {
    res.json(cart.cartItems);
  } else {
    res.status(400).json({ message: 'Unable to update cart database data' });
  }
};
import Order from '../models/orderModel.js';

// @desc    Create new order entries in the database
// @route   POST /api/orders
// @access  Private 
export const addOrderItems = async (req, res) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = req.body;

  try {
    if (orderItems && orderItems.length === 0) {
      return res.status(400).json({ message: 'No ordered items provided' });
    } else {
      // Construct the database model instance
      const order = new Order({
        orderItems: orderItems.map((x) => ({
          ...x,
          product: x._id, // Maps frontend product ID to database product reference field
          _id: undefined
        })),
        user: req.user._id, // Automatically extracted by your protect middleware token reader
        shippingAddress,
        paymentMethod,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
      });

      const createdOrder = await order.save();
      return res.status(201).json(createdOrder);
    }
  } catch (error) {
    console.error('❌ ERROR IN addOrderItems CONTROLLER:', error);
    return res.status(500).json({ message: `Order creation failed: ${error.message}` });
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
export const getOrderById = async (req, res) => {
  try {
    // .populate automatically pulls the customer's name and email into the object
    const order = await Order.findById(req.params.id).populate('user', 'name email');

    if (order) {
      // 🛡️ Security Check: Ensure the logged-in user owns this order (or is an admin)
      if (req.user.isAdmin || order.user._id.toString() === req.user._id.toString()) {
        return res.json(order);
      } else {
        return res.status(401).json({ message: 'Not authorized to view this order asset' });
      }
    } else {
      return res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    console.error('❌ ERROR IN getOrderById CONTROLLER:', error);
    // Gracefully handles malformed MongoDB ObjectIDs without crashing Node
    return res.status(500).json({ message: `Order lookup failed: ${error.message}` });
  }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
export const getMyOrders = async (req, res) => {
  try {
    // Finds all documents in the orders collection matching the logged-in user's ID
    const orders = await Order.find({ user: req.user._id });
    return res.json(orders);
  } catch (error) {
    console.error('❌ ERROR IN getMyOrders CONTROLLER:', error);
    return res.status(500).json({ message: `Failed to load order history: ${error.message}` });
  }
};
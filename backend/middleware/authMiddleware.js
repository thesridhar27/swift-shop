import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';

export const protect = async (req, res, next) => {
  let token;
  
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'sridhara_secret_key_98765');
      req.user = await User.findById(decoded.id).select('-password');
      
      // Explicitly invoke the next middleware or controller layer in the execution queue
      if (typeof next === 'function') {
        return next();
      }
    } catch (error) {
      res.status(401);
      return res.json({ message: 'Not authorized, token validation failed' });
    }
  }
  
  if (!token) {
    res.status(401);
    return res.json({ message: 'Not authorized, no session token found' });
  }
};
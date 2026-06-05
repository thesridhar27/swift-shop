import jwt from 'jsonwebtoken';

const generateToken = (id) => {
  // Signs a new token containing the user's MongoDB _id, valid for 30 days
  return jwt.sign({ id }, process.env.JWT_SECRET || 'fallback_secret_key_1234', {
    expiresIn: '30d',
  });
};

export default generateToken;
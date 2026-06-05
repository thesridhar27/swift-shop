import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import mongoose from 'mongoose';

dotenv.config();

// 📁 Import Route Handlers
import userRoutes from './routes/userRoutes.js';
import productRoutes from './routes/productRoutes.js'; 
import orderRoutes from './routes/orderRoutes.js'; // 👈 ADDED: Order routing engine
import cartRoutes from './routes/cartRoutes.js';   // 👈 ADDED: Cart database syncing engine

const app = express();

app.use(express.json());
app.use(cors());

// 🎛️ Mount Endpoints Routing Matrix
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes); 
app.use('/api/orders', orderRoutes); // 👈 ADDED: Handles /api/orders payloads cleanly!
app.use('/api/cart', cartRoutes);     // 👈 ADDED: Handles /api/cart syncing endpoints!

app.get('/', (req, res) => {
  res.send('API Engine is running smoothly...');
});

// 🗄️ Database Connection Gateway
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`✅ MongoDB Connected Safely: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ Database connection failure: ${error.message}`);
    process.exit(1);
  }
};

connectDB();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server executing cleanly on port ${PORT}`));
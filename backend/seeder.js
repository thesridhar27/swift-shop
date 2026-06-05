import mongoose from 'mongoose';
import dotenv from 'dotenv';
import users from './users.js';       // 👈 FIXED: Pulled directly from backend/users.js
import products from './products.js';   // 👈 FIXED: Pulled directly from backend/products.js
import User from './models/userModel.js';
import Product from './models/productModel.js';
import Order from './models/orderModel.js';

// 🔥 Initialize configuration variables first!
dotenv.config();

const importData = async () => {
  try {
    // 🔌 1. Force the script to connect to MongoDB Atlas and wait until it is ready
    console.log('Connecting to database...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Database connected. Starting data import...');

    // 🗑️ 2. Clean out any existing collections safely
    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();

    // 👤 3. Seed your default users
    const createdUsers = await User.insertMany(users);

    // Get the administrative user ID to associate with your product catalog
    const adminUser = createdUsers[0]._id;

    // 🛒 4. Map the admin user ID onto each product asset array block
    const sampleProducts = products.map((product) => {
      return { ...product, user: adminUser };
    });

    // 🚀 5. Bulk insert your products into MongoDB Atlas
    await Product.insertMany(sampleProducts);

    console.log('🎉 Data Imported Successfully!');
    process.exit();
  } catch (error) {
    console.error(`❌ Data Import Failure: ${error.message}`);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();

    console.log('🗑️ Data Destroyed Successfully!');
    process.exit();
  } catch (error) {
    console.error(`❌ Data Destruction Failure: ${error.message}`);
    process.exit(1);
  }
};

// Check for command flags to determine path execution
if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}
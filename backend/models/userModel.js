import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String, unique: true, sparse: true }, 
    isAdmin: { type: Boolean, required: true, default: false },
  },
  { timestamps: true }
);

// Method to verify submitted password against stored hash data
userSchema.methods.matchPassword = async function (enteredPassword) {
  try {
    // 🛡️ Log the comparison to your terminal console for easy verification tracking
    console.log('🔑 Comparing plain text with DB Hash string...');
    return await bcrypt.compare(enteredPassword, this.password);
  } catch (error) {
    console.error('❌ Error comparing passwords:', error);
    return false;
  }
};

// 🔐 FIXED: Built-in Mongoose modification state isolation hook
userSchema.pre('save', async function () {
  // 🔥 CRITICAL CHANGE: If the password field was NOT explicitly updated/created, 
  // exit immediately! This completely stops background saves from corrupting hashes.
  if (!this.isModified('password')) {
    return; 
  }

  try {
    // Clean, direct encryption line using salt rounds
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    console.log('🔒 Password successfully encrypted into clean hash!');
  } catch (error) {
    throw new Error(`Password hashing encryption failed: ${error.message}`);
  }
});

const User = mongoose.model('User', userSchema);
export default User;
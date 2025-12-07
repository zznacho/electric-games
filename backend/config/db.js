// backend/config/db.js
import mongoose from 'mongoose';

const connectDB = async (uri) => {
  try {
    await mongoose.connect(uri);
    console.log('MongoDB conectado');
  } catch (err) {
    console.error('Error conectando a MongoDB', err);
    process.exit(1);
  }
};

export default connectDB;

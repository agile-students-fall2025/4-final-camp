const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/camp';
    
    await mongoose.connect(mongoURI);
    
    console.log('MongoDB connected successfully');
    console.log(`Database: ${mongoose.connection.name}`);
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    console.error('Server will continue but database operations will fail');
    // Don't exit - allow server to run for debugging
  }
};

module.exports = connectDB;

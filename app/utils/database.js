import mongoose from 'mongoose';

// Track if we're connected to MongoDB
let isConnected = false;

/**
 * Connect to MongoDB
 * This function handles connecting to MongoDB and caches the connection
 */
export async function connectDB() {
  // If we're already connected, don't connect again
  if (isConnected) {
    return;
  }

  // Connection options
  const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  };

  try {
    // Get the MongoDB URI from the environment variables
    const uri = process.env.MONGODB_URI;
    
    if (!uri) {
      throw new Error('MONGODB_URI is not defined in environment variables');
    }

    // Connect to MongoDB
    await mongoose.connect(uri, options);
    
    isConnected = true;
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    throw error;
  }
} 
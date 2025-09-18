import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI;
    if (!uri) {
      throw new Error("MONGO_URI is not set. Create a .env with MONGO_URI.");
    }

    // Optional: surface mongoose debug when needed
    if (process.env.MONGOOSE_DEBUG === 'true') {
      mongoose.set('debug', true);
    }

    const conn = await mongoose.connect(uri, {
      // These help with slow Atlas selection and modern drivers
      serverSelectionTimeoutMS: 45000,
      socketTimeoutMS: 60000,
      // The following are defaults in modern mongoose but kept explicit
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("❌ MongoDB connection error:", error?.message || error);
    console.error("Hints: \n- Verify MONGO_URI (use mongodb+srv for Atlas).\n- Add your IP to Atlas Network Access.\n- Ensure firewall allows TLS to *.mongodb.net:27017.\n- Check DNS resolution of your cluster hosts.\n- Try increasing serverSelectionTimeoutMS.");
    process.exit(1);
  }
};

export default connectDB;

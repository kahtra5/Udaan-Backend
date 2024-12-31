import mongoose from "mongoose";
export const connectToMongoDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI,  {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (err) {
    console.error(`Error: ${err.message}`);
    process.exit(1); // Exit process if MongoDB connection fails
  }
};

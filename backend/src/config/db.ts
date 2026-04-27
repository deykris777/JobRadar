import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/jobboard");
    console.log(`\n🍃 MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`\n❌ Error: ${(error as Error).message}`);
    process.exit(1);
  }
};

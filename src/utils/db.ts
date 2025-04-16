import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async () => {
  try {
    const test_uri = process.env.TEST_MONGO_URI;
    const prod_uri = process.env.TEST_MONGO_URI;
    const uri =
      (process.env.MONGO_URI as string) === 'test' ? test_uri : prod_uri;
    const conn = await mongoose.connect(uri!);

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(error);
  }
};

export default connectDB;

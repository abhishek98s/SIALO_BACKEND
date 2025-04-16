import mongoose from 'mongoose';
import { config } from '../config/config';

const connectDB = async () => {
  try {
    const test_uri = config.database.TEST_MONGO_URI;
    const prod_uri = config.database.TEST_MONGO_URI;
    const uri =
      (config.database.MONGO_URI as string) === 'test' ? test_uri : prod_uri;
    const conn = await mongoose.connect(uri!);

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(error);
  }
};

export default connectDB;

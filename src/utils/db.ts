import mongoose from 'mongoose';
import { config } from '../config/config';

const connectDB = async () => {
  try {
    const test_uri = config.database.TEST_MONGO_URI;
    const prod_uri = config.database.TEST_MONGO_URI;

    const uri: string = (config.app.env === 'test' ? test_uri : prod_uri) || '';
    await mongoose.connect(uri);

    // console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(error);
  }
};

export const closeDatabase = async () => {
  await mongoose.connection.close();
};

export const clearDatabase = async () => {
  await mongoose.connection.dropDatabase();
};

export default connectDB;

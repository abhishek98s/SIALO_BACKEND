import mongoose from 'mongoose';
import { config } from '../config/config';

const connectDB = async () => {
  try {
    const test_uri = config.database.TEST_MONGO_URI;
    const prod_uri = config.database.TEST_MONGO_URI;

    const uri: string = (config.app.env === 'test' ? test_uri : prod_uri) || '';
    const conn = await mongoose.connect(uri);

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(error);
  }
};

export const closeDatabase = async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
};

export const clearDatabase = async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany({});
  }
};

export default connectDB;

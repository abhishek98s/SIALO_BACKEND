/** @format */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { logger } from '../config/logger';

dotenv.config();

const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI as string;
    const conn = await mongoose.connect(uri);

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(error);
  }
};

export default connectDB;

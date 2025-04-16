import connectDB from '../utils/db';
import userSeed from './user.seed';

import mongoose from 'mongoose';

const seedDatabase = async () => {
  try {
    await connectDB();
    await userSeed();
    console.error('Seed runned:');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    mongoose.connection.close();
  }
};

seedDatabase();

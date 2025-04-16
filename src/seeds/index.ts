import connectDB from '../utils/db';
import postSeed from './posts.seed';
import storySeed from './story.seed';
import userSeed from './user.seed';

import mongoose from 'mongoose';

const seedDatabase = async () => {
  try {
    await connectDB();
    await userSeed();
    await storySeed();
    await postSeed();

    console.log('\x1b[33mSeeds executed successfully:\x1b[0m\n\n\n');
  } catch (error) {
    console.log('\x1b[31mError seeding database:\x1b[0m\n\n\n', error);
  } finally {
    mongoose.connection.close();
  }
};

seedDatabase();

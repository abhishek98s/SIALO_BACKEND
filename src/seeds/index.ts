import connectDB from '../utils/db';
import postSeed from './posts.seed';
import storySeed from './story.seed';
import userSeed from './user.seed';

export const seedDatabase = async () => {
  try {
    await connectDB();
    await userSeed();
    await storySeed();
    await postSeed();
  } catch (error) {
    console.log('\x1b[31mError seeding database:\x1b[0m\n\n\n', error);
  }
};

seedDatabase();

import mongoose from 'mongoose';
import connectDB from '../utils/db';
import postSeed from './posts.seed';
import storySeed from './story.seed';
import userSeed from './user.seed';

export const seedDatabase = async () => {
  const users = await userSeed();
  const storys = await storySeed();
  const posts = await postSeed();

  return { users, storys, posts };
};

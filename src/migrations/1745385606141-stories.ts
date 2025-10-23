// Import your schemas here
import type { Connection } from 'mongoose';
import connectDB from '../utils/db';
import Story from '../domains/story/story.model';
import { storySeed } from '../seeds/story.seed';
import { userData } from '../utils/populate';

export async function up(): Promise<void> {
  await connectDB();
  const userArr = await userData();

  const seedData = storySeed(userArr);

  await Story.create(seedData);
}

export async function down(connection: Connection): Promise<void> {
  await connectDB();
  await connection.dropCollection('story');
}

// Import your schemas here
import type { Connection } from 'mongoose';
import connectDB from '../utils/db';
import Story from '../domains/story/story.model';
import { seedStories } from '../seeds/story.seed';

export async function up(): Promise<void> {
  await connectDB();
  await Story.deleteMany({});
  await Story.create(seedStories);
}

export async function down(connection: Connection): Promise<void> {
  await connectDB();
  await connection.dropCollection('story');
}

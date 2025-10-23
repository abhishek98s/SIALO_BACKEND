// Import your schemas here
import type { Connection } from 'mongoose';
import Post from '../domains/post/post.model';
import connectDB from '../utils/db';
import { userData } from '../utils/populate';
import { postSeed } from '../seeds/posts.seed';

export async function up(): Promise<void> {
  await connectDB();
  const userArr = await userData();

  const seedData = postSeed(userArr);

  await Post.create(seedData);
}

export async function down(connection: Connection): Promise<void> {
  await connectDB();
  await connection.dropCollection('posts');
}

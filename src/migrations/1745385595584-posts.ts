// Import your schemas here
import type { Connection } from 'mongoose';
import Post from '../domains/post/post.model';
import connectDB from '../utils/db';
import { seedPosts } from '../seeds/posts.seed';

export async function up(): Promise<void> {
  await connectDB();
  await Post.deleteMany({});
  await Post.create(seedPosts);
}

export async function down(connection: Connection): Promise<void> {
  await connectDB();
  await connection.dropCollection('posts');
}

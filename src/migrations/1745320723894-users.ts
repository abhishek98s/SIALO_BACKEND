// Import your schemas here
import type { Connection } from 'mongoose';
import { User } from '../domains/user/user.model';
import connectDB from '../utils/db';
import { seedUsers } from '../seeds/user.seed';

export async function up(): Promise<void> {
  await connectDB();
  await User.create(seedUsers);
}

export async function down(connection: Connection): Promise<void> {
  await connectDB();
  await connection.dropCollection('users');
}

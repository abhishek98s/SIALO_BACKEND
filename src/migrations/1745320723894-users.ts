// Import your schemas here
import type { Connection } from 'mongoose';
import { User } from '../domains/user/user.model';
import { seedDatabase } from '../seeds';

export async function up(): Promise<void> {
  const users = (await seedDatabase()).users;
  await User.create(users);
}

export async function down(connection: Connection): Promise<void> {
  await connection.dropCollection('users');
}

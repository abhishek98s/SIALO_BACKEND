import { Migrator } from 'ts-migrate-mongoose';
import { config } from '../config/config';
import connectDB from './db';

export const populateDb = async () => {
  try {
    await connectDB();
    const migrator = await Migrator.connect({
      uri: config.database.TEST_MONGO_URI || '',
      autosync: true,
    });

    const migrations = await migrator.list();
    await migrator.run('up');

    migrations.forEach(async (mi) => {
      await migrator.run('up', mi.name);
    });
    await migrator.sync();
  } catch (e) {
    console.log((e as Error).message);
  }
};

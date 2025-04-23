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
    migrations.forEach(async (mi) => {
      await migrator.run('up', mi.name);
    });
    // console.log(migrations);
    await migrator.sync();
  } catch (e) {
    console.log((e as Error).message);
  }
};

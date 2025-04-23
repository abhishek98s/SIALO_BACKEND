import { config as appConfig } from './config';

export default {
  uri: appConfig.database.TEST_MONGO_URI,
  collection: 'migrations',
  migrationsPath: './src/migrations',
  autosync: false,
};

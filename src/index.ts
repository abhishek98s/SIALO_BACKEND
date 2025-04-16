import connectDB from './utils/db';
import { config } from './config/config';
import app from './app';

const port = config.app.port;
const name = config.app.name;

const start = async () => {
  try {
    await connectDB();
    app.listen(port, () => {
      console.log(`${name} started at http://localhost:${port}`);
    });
  } catch (err) {
    console.error(err);
  }
};

start();

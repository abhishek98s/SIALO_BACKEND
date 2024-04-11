import express from 'express';
import { config } from './config/config';
import cors from 'cors';
import connectDB from './utils/db';
import { logger } from './config/logger';

const app = express();
const port = config.app.port;
const name = config.app.name;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Sialo : Social Media App');
});

const start = async () => {
    try {
        await connectDB();
        app.listen(port, () => { console.log(`${name} started at http://localhost:${port}`); });
    } catch (err) {
        logger.error(err);
    }
};

start();

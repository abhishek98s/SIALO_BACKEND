import express from 'express';
import cors from 'cors';

import { config } from './config/config';
import { logger } from './config/logger';
import { swagger } from './swagger/swagger';
import connectDB from './utils/db';
import notFound from './utils/not-found';
import { errorHandlerMiddleware } from './utils/error-handler';

import userRoute from './domains/user/user.routes';
import authRoute from './auth/auth.routes';
import postRoute from './domains/post/post.routes';

const app = express();
const port = config.app.port;
const name = config.app.name;

app.use(cors());
app.use(express.json());

swagger(app);

app.use('/api/auth', authRoute);
app.use('/api/user', userRoute);
app.use('/api/post', postRoute);

app.use(notFound);
app.use(errorHandlerMiddleware);

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

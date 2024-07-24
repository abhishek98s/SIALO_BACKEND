import express from 'express';
import cors from 'cors';

import { config } from './config/config';
import { logger } from './config/logger';
import { swagger } from './swagger/swagger';
import connectDB from './utils/db';
import notFound from './utils/not-found';
import { errorHandlerMiddleware } from './utils/error-handler';
import bodyParser from 'body-parser';

import userRoute from './domains/user/user.routes';
import authRoute from './auth/auth.routes';
import postRoute from './domains/post/post.routes';
import storyRoute from './domains/story/story.routes';
import { cron_story } from './cron/story.crone';

const app = express();
const port = config.app.port;
const name = config.app.name;

app.use(cors({
    origin: '*',
    methods: ['*'],
    allowedHeaders: ['*'],
}));
import pathToSwaggerUi from 'swagger-ui-dist'
app.use(express.static(pathToSwaggerUi.absolutePath()))

app.use(express.json())
app.use(bodyParser.json()); app.use(bodyParser.urlencoded({ extended: true }));


swagger(app);

app.use('/api/auth', authRoute);
app.use('/api/user', userRoute);
app.use('/api/post', postRoute);
app.use('/api/story', storyRoute);

app.use(notFound);
app.use(errorHandlerMiddleware);

app.get('/', (req, res) => {
    res.send('Sialo : Social Media App');
});

cron_story();

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

export default app;
import express from 'express';
import cors from 'cors';
import 'express-async-errors';
import bodyParser from 'body-parser';
import pathToSwaggerUi from 'swagger-ui-dist';

import { swagger } from './swagger/swagger';
import notFound from './utils/not-found';
import { errorHandlerMiddleware } from './utils/error-handler';

import authRoute from './auth/auth.routes';
import { cron_story } from './cron/story.crone';
import userRoute from './domains/user/user.routes';
import postRoute from './domains/post/post.routes';
import storyRoute from './domains/story/story.routes';

const app = express();

app.use(
  cors({
    origin: '*',
    methods: ['*'],
    allowedHeaders: ['*'],
  }),
);
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(pathToSwaggerUi.absolutePath()));

swagger(app);

app.use('/api/auth', authRoute);
app.use('/api/user', userRoute);
app.use('/api/post', postRoute);
app.use('/api/story', storyRoute);

app.get('/', (req, res) => {
  res.send('Sialo : Social Media App');
});

// cron_story();
app.use('/cron', cron_story);

app.use(errorHandlerMiddleware);
app.use(notFound);

export default app;

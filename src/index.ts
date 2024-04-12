import express from 'express';
import { config } from './config/config';
import cors from 'cors';
import connectDB from './utils/db';
import { logger } from './config/logger';

import userRoute from './domains/user/user.routes';
import { swagger } from './swagger/swagger';
import notFound from './middleware/not-found';
import { errorHandlerMiddleware } from './middleware/error-handler';

const app = express();
const port = config.app.port;
const name = config.app.name;

app.use(cors());
app.use(express.json());

app.use('/api/user', userRoute);

swagger(app);
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

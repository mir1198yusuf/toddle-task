import * as dotenv from 'dotenv';
dotenv.config({ path: './.env' });
import express from 'express';
import http from 'http';
import bodyParser from 'body-parser';
import cors from 'cors';
import { mainRouter } from './routes/main.route.js';
import { routeNotFoundMiddleware } from './middlewares/route-not-found.middleware.js';
import { errorMiddleware } from './middlewares/error.middleware.js';
import { loggingMiddleware } from './middlewares/logging.middleware.js';
import { checkEnvsOnStartup } from './lib/startup-env-check.lib.js';

checkEnvsOnStartup();

const expressApp = express();
const httpServer = http.createServer(expressApp);

expressApp.use(loggingMiddleware);

expressApp.set('trust proxy', true);

expressApp.use(bodyParser.json());

expressApp.use('/uploads', express.static('uploads'));

expressApp.use(cors());

expressApp.use(mainRouter);

expressApp.get('/', (req, res) => {
    res.status(302).redirect(
        'https://www.postman.com/ym-356609/workspace/ym-team/collection/16305790-832c639b-bd7a-4e8d-ae20-4caa83107411?action=share&creator=16305790'
    );
});

expressApp.use(routeNotFoundMiddleware);

expressApp.use(errorMiddleware);

httpServer.listen(process.env.SERVER_PORT, function () {
    console.log(`Server started at ${process.env.SERVER_PORT}`);
});

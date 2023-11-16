import { Router } from 'express';
import { signinMiddleware } from '../middlewares/auth.middleware.js';
import { signinController } from '../controllers/auth.controller.js';

const authRouter = Router();

authRouter.route(`/signin`).post(signinMiddleware, signinController);

export { authRouter };

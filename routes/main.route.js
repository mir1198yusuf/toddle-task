import { Router } from 'express';
import { authRouter } from './auth.route.js';
import { classroomsRouter } from './classrooms.route.js';
import { studentsRouter } from './students.route.js';
import { filesRouter } from './files.route.js';

const mainRouter = Router();

mainRouter.use('/auth', authRouter);
mainRouter.use('/classrooms', classroomsRouter);
mainRouter.use('/students', studentsRouter);
mainRouter.use('/files', filesRouter);

export { mainRouter };

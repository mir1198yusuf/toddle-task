import { Router } from 'express';
import {
    jwtMiddleware,
    tutorAllowedRoutesMiddleware
} from '../middlewares/auth.middleware.js';
import { addStudentsToClassroomMiddleware } from '../middlewares/students.middleware.js';
import { addStudentsToClassroomController } from '../controllers/students.controller.js';

const studentsRouter = Router();

studentsRouter
    .route(`/classroom/:classroomId`)
    .post(
        jwtMiddleware,
        tutorAllowedRoutesMiddleware,
        addStudentsToClassroomMiddleware,
        addStudentsToClassroomController
    );
export { studentsRouter };

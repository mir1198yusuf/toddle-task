import { Router } from 'express';
import {
    createClassroomMiddleware,
    deleteClassroomMiddleware,
    updateClassroomMiddleware
} from '../middlewares/classrooms.middleware.js';
import {
    createClassroomController,
    deleteClassroomController,
    getClassroomFeedController,
    updateClassroomController
} from '../controllers/classrooms.controller.js';
import {
    jwtMiddleware,
    tutorAllowedRoutesMiddleware
} from '../middlewares/auth.middleware.js';

const classroomsRouter = Router();

// create classroom
classroomsRouter
    .route(`/`)
    .post(
        jwtMiddleware,
        tutorAllowedRoutesMiddleware,
        createClassroomMiddleware,
        createClassroomController
    );

// update classroom
classroomsRouter
    .route(`/:classroomId`)
    .put(
        jwtMiddleware,
        tutorAllowedRoutesMiddleware,
        updateClassroomMiddleware,
        updateClassroomController
    );

// delete classroom
classroomsRouter
    .route(`/:classroomId`)
    .delete(
        jwtMiddleware,
        tutorAllowedRoutesMiddleware,
        deleteClassroomMiddleware,
        deleteClassroomController
    );

// classroom feed
classroomsRouter.route(`/feed`).get(jwtMiddleware, getClassroomFeedController);

export { classroomsRouter };

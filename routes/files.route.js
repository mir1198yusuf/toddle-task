import { Router } from 'express';
import {
    jwtMiddleware,
    tutorAllowedRoutesMiddleware
} from '../middlewares/auth.middleware.js';
import {
    addFileToClassroomMiddleware,
    deleteFileMiddleware,
    getFileFeedMiddleware,
    updateFileMiddleware
} from '../middlewares/files.middleware.js';
import {
    addFileToClassroomController,
    deleteFileController,
    getFileFeedController,
    updateFileController
} from '../controllers/files.controller.js';
import { multerInstance } from '../lib/multer.lib.js';

const filesRouter = Router();

filesRouter.route(`/classroom/:classroomId`).post(
    jwtMiddleware,
    tutorAllowedRoutesMiddleware,
    multerInstance.single('file_attachment'),
    /*  
        multer.single will return a middleware that will handle single file in multipart/form-data. 
        it will auto save the file to destination directory & attach file to req.file and other form-data non-file keys to req.body object
    */
    addFileToClassroomMiddleware,
    addFileToClassroomController
);

filesRouter
    .route(`/:fileId`)
    .put(
        jwtMiddleware,
        tutorAllowedRoutesMiddleware,
        updateFileMiddleware,
        updateFileController
    );

filesRouter
    .route(`/:fileId`)
    .delete(
        jwtMiddleware,
        tutorAllowedRoutesMiddleware,
        deleteFileMiddleware,
        deleteFileController
    );

filesRouter
    .route(`/classroom/:classroomId/feed`)
    .get(jwtMiddleware, getFileFeedMiddleware, getFileFeedController);

export { filesRouter };

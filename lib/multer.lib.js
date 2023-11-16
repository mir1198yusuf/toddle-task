import multer from 'multer';
import { CustomError } from './custom.error.js';

const multerInstance = multer({
    storage: multer.diskStorage({
        destination: 'uploads',
        filename: function (req, file, cb) {
            if (
                req.baseUrl === '/files' &&
                req.route.path === '/classroom/:classroomId'
            ) {
                cb(
                    null,
                    `${Date.now()}_${req.body.title}_${file.originalname}`
                );
            } else {
                throw new CustomError(
                    500,
                    'File uploads not configured for this route',
                    `File uploads not configured for this route ${req.baseUrl}${req.route.path}`
                );
            }
        }
    }),
    limits: {
        fileSize: 5242880 // 50 MB
    }
});

export { multerInstance };

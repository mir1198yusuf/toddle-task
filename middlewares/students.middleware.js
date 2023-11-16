import joi from 'joi';
import { validateWithJoi } from '../lib/joi-validation.lib.js';

function addStudentsToClassroomMiddleware(req, res, next) {
    try {
        validateWithJoi(
            { student_user_ids: joi.array().items(joi.number().required()) },
            req.body
        );
        validateWithJoi({ classroomId: joi.number().required() }, req.params);

        next();
    } catch (error) {
        next(error);
    }
}

export { addStudentsToClassroomMiddleware };

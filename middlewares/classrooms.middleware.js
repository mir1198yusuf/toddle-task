import joi from 'joi';
import { CustomError } from '../lib/custom.error.js';
import { validateWithJoi } from '../lib/joi-validation.lib.js';

function createClassroomMiddleware(req, res, next) {
    try {
        validateWithJoi({ name: joi.string().required() }, req.body);

        next();
    } catch (error) {
        next(error);
    }
}

function updateClassroomMiddleware(req, res, next) {
    try {
        validateWithJoi({ name: joi.string().required() }, req.body);
        validateWithJoi({ classroomId: joi.number().required() }, req.params);

        next();
    } catch (error) {
        next(error);
    }
}

function deleteClassroomMiddleware(req, res, next) {
    try {
        validateWithJoi({ classroomId: joi.number().required() }, req.params);

        next();
    } catch (error) {
        next(error);
    }
}

export {
    createClassroomMiddleware,
    updateClassroomMiddleware,
    deleteClassroomMiddleware
};

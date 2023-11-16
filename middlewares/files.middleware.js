import joi from 'joi';
import { validateWithJoi } from '../lib/joi-validation.lib.js';
import { FILE_TYPES } from '../constants/files.constant.js';

function addFileToClassroomMiddleware(req, res, next) {
    try {
        validateWithJoi(
            {
                title: joi.string().required(),
                description: joi.string().required(),
                type: joi
                    .string()
                    .valid(...Object.values(FILE_TYPES))
                    .required(),
                url: joi.when('type', {
                    is: FILE_TYPES.URL,
                    then: joi.string().uri().required(),
                    otherwise: joi.forbidden()
                })
            },
            req.body
        );
        validateWithJoi({ classroomId: joi.number().required() }, req.params);
        if (req.body.type !== FILE_TYPES.URL) {
            validateWithJoi(
                {
                    fieldname: joi.string().valid('file_attachment').required(),
                    path: joi.string().required()
                },
                { fieldname: req.file.fieldname, path: req.file.path }
            );
        }

        next();
    } catch (error) {
        next(error);
    }
}

function updateFileMiddleware(req, res, next) {
    try {
        validateWithJoi(
            {
                title: joi.string().optional(),
                description: joi.string().optional()
            },
            req.body
        );
        validateWithJoi({ fileId: joi.number().required() }, req.params);

        next();
    } catch (error) {
        next(error);
    }
}

function deleteFileMiddleware(req, res, next) {
    try {
        validateWithJoi({ fileId: joi.number().required() }, req.params);

        next();
    } catch (error) {
        next(error);
    }
}

function getFileFeedMiddleware(req, res, next) {
    try {
        validateWithJoi(
            {
                fileType: joi
                    .string()
                    .valid(...Object.values(FILE_TYPES))
                    .optional(),
                search: joi.string().optional()
            },
            req.query
        );

        validateWithJoi({ classroomId: joi.number().required() }, req.params);
        next();
    } catch (error) {
        next(error);
    }
}

export {
    addFileToClassroomMiddleware,
    updateFileMiddleware,
    deleteFileMiddleware,
    getFileFeedMiddleware
};

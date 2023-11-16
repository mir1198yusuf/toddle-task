import joi from 'joi';
import { CustomError } from '../lib/custom.error.js';
import { verifyJWT } from '../services/auth.service.js';
import { validateWithJoi } from '../lib/joi-validation.lib.js';
import { ROLES } from '../constants/roles.constant.js';

function signinMiddleware(req, res, next) {
    try {
        validateWithJoi(
            {
                username: joi.string().required(),
                password: joi.string().required(),
                role: joi
                    .string()
                    .valid(...Object.values(ROLES))
                    .required()
            },
            req.body
        );

        next();
    } catch (error) {
        next(error);
    }
}

function jwtMiddleware(req, res, next) {
    try {
        const authHeader = req.headers['authorization'];

        const token = authHeader?.split(' ')[1];
        if (!token) {
            throw new CustomError(
                401,
                'Auth token empty',
                `Auth token empty ${authHeader}`
            );
        }

        const payload = verifyJWT(token, process.env.JWT_SECRET);

        validateWithJoi(
            {
                userId: joi.number().required(),
                role: joi
                    .string()
                    .valid(...Object.values(ROLES))
                    .required(),
                iat: joi.number().required(),
                exp: joi.number().required()
            },
            payload
        );

        res.locals = {
            userId: payload.userId,
            role: payload.role
        };

        next();
    } catch (error) {
        next(error);
    }
}

function tutorAllowedRoutesMiddleware(req, res, next) {
    try {
        if (res.locals.role === ROLES.TUTOR) next();
        else
            throw new CustomError(
                403,
                'Not allowed for current role',
                `Not allowed for current role ${res.locals.role}`
            );
    } catch (error) {
        next(error);
    }
}

export { signinMiddleware, jwtMiddleware, tutorAllowedRoutesMiddleware };
